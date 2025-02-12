This is how to setup the JavaScript library:

```js
const version = '0.24.2';
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
```