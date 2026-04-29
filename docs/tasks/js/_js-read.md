
Initialize the SDK with [`createC2pa`](https://contentauth.github.io/c2pa-js/modules/_contentauth_c2pa-web.html#createc2pa), then use [`reader.fromBlob`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.ReaderFactory.html#fromblob) to open an asset. Call [`manifestStore`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html#manifeststore) for the full store, or [`activeManifest`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html#activemanifest) for the active claim.

Always call [`reader.free()`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html#free) when finished, and [`c2pa.dispose()`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.C2paSdk.html#dispose) when tearing down the worker.

### Read from a `Blob`

With Vite (or similar), load the Wasm URL:

```typescript
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

const c2pa = await createC2pa({ wasmSrc });

const response = await fetch('/signed-image.jpg');
const blob = await response.blob();

const reader = await c2pa.reader.fromBlob(blob.type, blob);
if (!reader) {
  console.log('No C2PA manifest found.');
  c2pa.dispose();
  return;
}

const manifestStore = await reader.manifestStore();
console.log(JSON.stringify(manifestStore, null, 2));

const active = await reader.activeManifest();
console.log('Active title:', active.title);

await reader.free();
c2pa.dispose();
```

Optional [per-read settings](../settings.mdx) override the defaults passed to `createC2pa`:

```typescript
const reader = await c2pa.reader.fromBlob(blob.type, blob, {
  verify: { verifyAfterReading: false, verifyTrust: true },
});
```

### Inline Wasm (no separate `.wasm` request)

For constrained environments, use [`@contentauth/c2pa-web/inline`](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web#using-an-inline-wasm-binary) (larger bundle):

```typescript
import { createC2pa } from '@contentauth/c2pa-web/inline';

const c2pa = await createC2pa();
```

See the [c2pa-web README](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web) for CDN-hosted Wasm and API details.
