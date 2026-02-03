Notes:
- You provide the `Signer`. In production, this object wraps a service/HSM that returns a proper signature for your algorithm (`es256`, `ps256`, `ed25519`, etc.). Set `reserveSize` to a value large enough for timestamps/countersignatures your signer adds.
- To attach a remote manifest instead of embedding, use `builder.setRemoteUrl(url)` and `builder.setNoEmbed(true)` before signing.

```js
import { createC2pa, type Signer } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

// 1) Create a Signer that calls your backend (which returns the signature bytes)
function createRemoteSigner(): Signer {
  return {
    alg: 'es256',
    reserveSize: async () => 4096, // bytes to reserve for TSA/countersignature (tune as needed)
    sign: async (toBeSigned: Uint8Array, _reserveSize: number) => {
      const res = await fetch('/api/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alg: 'es256',
          payload: Array.from(toBeSigned),
        }),
      });
      if (!res.ok) throw new Error('Signing failed');
      const sigBytes = new Uint8Array(await res.arrayBuffer());
      return sigBytes;
    },
  };
}

async function run() {
  // 2) Initialize the SDK
  const c2pa = await createC2pa({ wasmSrc });

  // 3) Fetch the asset to sign
  const imgUrl = 'https://contentauth.github.io/example-assets/images/cloudscape-ACA-Cr.jpeg';
  const resp = await fetch(imgUrl);
  const assetBlob = await resp.blob();

  // 4) Build a simple manifest (add a created action and optional thumbnail)
  const builder = await c2pa.builder.new();
  await builder.addAction({
    action: 'c2pa.created',
    digitalSourceType: 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
  });
  // Optional: include a thumbnail that represents the asset
  await builder.setThumbnailFromBlob('image/jpeg', assetBlob);

  // 5) Sign and get a new asset with the manifest embedded
  const signer = createRemoteSigner();
  const signedBytes = await builder.sign(signer, assetBlob.type, assetBlob);

  // 6) Use/save the signed asset
  const signedBlob = new Blob([signedBytes], { type: assetBlob.type });
  const url = URL.createObjectURL(signedBlob);
  // e.g., download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signed.jpg';
  a.click();
  URL.revokeObjectURL(url);

  // Cleanup
  await builder.free();
  c2pa.dispose();
}

run().catch(console.error);
```

To retrieve manifest bytes alongside the signed asset:

```js
const { asset, manifest } = await builder.signAndGetManifestBytes(
  signer,
  assetBlob.type,
  assetBlob
);
// asset -> signed asset bytes
// manifest -> embedded manifest bytes
```