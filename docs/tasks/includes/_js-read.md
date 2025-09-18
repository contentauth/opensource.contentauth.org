:::note
That JavaScript library is being extensively revised so the APIs used here may change in the near future.
:::

Use [`c2pa.read`](../../docs/js-sdk/api/c2pa.c2pa#methods) to read manifest data from an asset; if the asset has a C2PA manifest and was processed without errors, the returned [`c2paReadResult`](../../docs/js-sdk/api/c2pa.c2pareadresult) contains a [`manifestStore`](../../docs/js-sdk/api/c2pa.c2pareadresult.manifeststore) object with several useful properties:

- **manifests**: An object containing all the asset's manifests ([`Manifest`](../../docs/js-sdk/api/c2pa.manifest) objects), keyed by UUID.
- **activeManifest**: A pointer to the latest [`manifest`](../../docs/js-sdk/api/c2pa.manifest) in the manifest store. Effectively the "parent" manifest, this is the likely starting point when inspecting an asset's C2PA data.
- **validationStatus**: A list of any validation errors encountered. See [Validation](../../docs/js-sdk/guides/validation) for more information.

```js
const version = '0.30.14';
const sampleImage = '<IMAGE_URL>';

import { createC2pa } from 'https://cdn.jsdelivr.net/npm/c2pa@${version}/+esm';

(async () => {
  // Initialize the c2pa-js SDK
  const c2pa = await createC2pa({
    wasmSrc:
      'https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/assets/wasm/toolkit_bg.wasm',
    workerSrc:
      'https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/c2pa.worker.min.js',
  });

  try {
    // Read in image and get a manifest store
    const { manifestStore } = await c2pa.read(sampleImage);
    console.log('manifestStore', manifestStore);

    // Get the active manifest
    const activeManifest = manifestStore?.activeManifest;
    console.log('activeManifest', activeManifest);
  } catch (err) {
    console.error('Error reading image:', err);
  }
})();
```
