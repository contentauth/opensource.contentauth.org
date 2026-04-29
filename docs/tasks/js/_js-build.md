
Use [`@contentauth/c2pa-web`](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web) to build manifests and sign assets in the browser. 

The high-level flow is: 
1. Call `await createC2pa({ wasmSrc, settings? })` 
1. Call `c2pa.builder.new()` / [`fromDefinition`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromdefinition) / [`fromArchive`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromarchive) 
1. Add actions, ingredients, thumbnails 
1. Call [`sign`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#sign) or [`signAndGetManifestBytes`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#signandgetmanifestbytes) 
1. Call `await builder.free()` and `c2pa.dispose()`.

You implement the [`Signer`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Signer.html) interface (`alg`, `reserveSize`, `sign`) so signing can call your backend, WebCrypto, or a test key.

:::warning
Never embed production private keys in client-side code. Instead use a remote signer (your API, KMS, or HSM) and harden the page against XSS.
:::

Embedding signed manifests into binary formats is handled here for supported web formats; for server-side embedding across all formats, use Node, Python, Rust, or C++.

### Remote signer example

```typescript
import { createC2pa, type Signer } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

function createRemoteSigner(): Signer {
  return {
    alg: 'es256',
    reserveSize: async () => 4096,
    sign: async (toBeSigned: Uint8Array) => {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: toBeSigned,
      });
      if (!res.ok) throw new Error('Signing failed');
      return new Uint8Array(await res.arrayBuffer());
    },
  };
}

async function run() {
  const c2pa = await createC2pa({ wasmSrc });

  const resp = await fetch('/image-to-sign.jpg');
  const assetBlob = await resp.blob();

  const builder = await c2pa.builder.new();
  await builder.addAction({
    action: 'c2pa.created',
    digitalSourceType:
      'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
  });
  await builder.setThumbnailFromBlob('image/jpeg', assetBlob);

  const signer = createRemoteSigner();
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

### Manifest bytes and remote manifest

```typescript
const { asset, manifest } = await builder.signAndGetManifestBytes(
  signer,
  assetBlob.type,
  assetBlob,
);
```

To publish a remote manifest instead of embedding, call [`setRemoteUrl`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#setremoteurl) and [`setNoEmbed(true)`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#setnoembed) before `sign`.

### Start from a manifest definition

```typescript
const builder = await c2pa.builder.fromDefinition({
  claim_generator_info: [{ name: 'my-app', version: '1.0.0' }],
  title: 'My image',
  format: 'image/jpeg',
  assertions: [],
  ingredients: [],
});
```

For [intents](../intents.mdx) and [archives](../archives.mdx), see the dedicated task pages.
