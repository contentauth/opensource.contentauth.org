- [Using a local signer](#using-a-local-signer)
- [Using a remote signer](#using-a-remote-signer)

## Using a local signer

:::info
You can use `c2pa-web` in the browser by implementing the [`Signer`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Signer.html) interface. That callback can use **local** cryptographic material (for example a non-extractable [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) from Web Crypto) so the private key never leaves the client. The current WASM integration uses **direct COSE handling**: `sign` receives the claim bytes and must return a **complete, encoded COSE signature** for C2PA (certificates, timestamps as required by your policy, and the signature itself). A raw ECDSA or RSA signature from `crypto.subtle.sign` is not sufficient on its own. Teams often implement that COSE step in a hardened signing service; doing it entirely in client JavaScript is possible but requires a COSE/C2PA-aware encoder on top of Web Crypto.
:::

Use [`@contentauth/c2pa-web`](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web) to build manifests and sign assets in the browser.

The high-level flow is:
1. Call `await createC2pa({ wasmSrc, settings? })`
1. Call `c2pa.builder.new()` / [`fromDefinition`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromdefinition) / [`fromArchive`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromarchive)
1. Add actions, ingredients, thumbnails
1. Call [`sign`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#sign) or [`signAndGetManifestBytes`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#signandgetmanifestbytes).
    - To publish a remote manifest instead of embedding, call [`setRemoteUrl`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#setremoteurl) and [`setNoEmbed(true)`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#setnoembed) before this call.
1. Call `await builder.free()` and `c2pa.dispose()`.

You implement the [`Signer`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Signer.html) interface (`alg`, `reserveSize`, `sign`) so the WASM layer can obtain a COSE signature for each claim.

:::warning
Browser pages are exposed to XSS: any script on the page can try to use keys that JavaScript can reach. Prefer **non-extractable** Web Crypto keys, user-gated imports (file input, `navigator.credentials`, or hardware where supported), and hardening such as CSP. Do not ship production private keys as PEM strings or other recoverable secrets in frontend bundles. If you use a **remote** signer instead, treat it like an API that must authorize exactly what is being signed (for example bind requests to a content hash and tight scopes), not as a generic “sign this blob” endpoint for an authenticated session.
:::

For obtaining and packaging certificates and keys outside the browser, see [Signing with local credentials](../../signing/local-signing).

Embedding signed manifests into binary formats is handled here for supported web formats; for server-side embedding across all formats, use Node, Python, Rust, or C++.

### Local Web Crypto signer example

The following shows how to use a **P-256 PKCS#8** key imported into Web Crypto inside `Signer.sign`. You still need to turn the raw signature and your certificate material into the **COSE Sign1** bytes C2PA expects (and honor `reserveSize`). The library does not ship a browser COSE encoder; use your own implementation or a signing path that already returns COSE.

```typescript
import { createC2pa, type Signer } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

/** Strip PEM headers and decode base64 DER (PKCS#8 private key). */
function pkcs8PemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function importEs256PrivateKey(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8PemToArrayBuffer(pem),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

function createLocalWebCryptoSigner(privateKey: CryptoKey): Signer {
  return {
    alg: 'es256',
    reserveSize: async () => 4096,
    sign: async (toBeSigned: Uint8Array, reserveSize: number) => {
      const raw = new Uint8Array(
        await crypto.subtle.sign(
          { name: 'ECDSA', hash: 'SHA-256' },
          privateKey,
          toBeSigned
        )
      );
      // Required for real manifests: build C2PA COSE_Sign1 using `raw`, your
      // end-entity certificate chain, timestamp policy, etc., and pad or size
      // the result to match `reserveSize`.
      void raw;
      void reserveSize;
      throw new Error(
        'Implement COSE Sign1 packaging for C2PA; raw Web Crypto output alone is not enough.'
      );
    },
  };
}

async function run() {
  const c2pa = await createC2pa({ wasmSrc });

  const resp = await fetch('/image-to-sign.jpg');
  const assetBlob = await resp.blob();

  // To instead create a minimal manifest definition, use
  // const builder = await c2pa.builder.new();
  const builder = await c2pa.builder.fromDefinition({
    claim_generator_info: [{ name: 'my-app', version: '1.0.0' }],
    title: 'My image',
    format: 'image/jpeg',
    assertions: [],
    ingredients: [],
  });

  await builder.addAction({
    action: 'c2pa.created',
    digitalSourceType:
      'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
  });
  await builder.setThumbnailFromBlob('image/jpeg', assetBlob);

  // Example: load PKCS#8 PEM from a file the user selects (keeps material out of the bundle).
  const pem = await new Promise<string>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pem,.key';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) reject(new Error('No file'));
      else resolve(await file.text());
    };
    input.click();
  });

  const privateKey = await importEs256PrivateKey(pem);
  const signer = createLocalWebCryptoSigner(privateKey);
  const signedBytes = await builder.sign(signer, assetBlob.type, assetBlob);

  const signedBlob = new Blob([signedBytes], { type: assetBlob.type });
  const url = URL.createObjectURL(signedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signed.jpg';
  a.click();
  URL.revokeObjectURL(url);

  await builder.free();
  c2pa.dispose();
}

void run();
```

:::note
Until `sign` returns valid COSE bytes, `builder.sign` will not succeed. If you already have a service or module that returns **finished** COSE for the claim, you can keep using Web Crypto only for the asymmetric step inside that module, or call that module from `sign` without using `fetch` to your own backend (for example an in-browser worker with the same origin). The important distinction is **where the private key lives** and **who builds COSE**, not whether `sign` is async.
:::
