This is how to set up your code to use the JavaScript library:

```js
const version = '0.27.1';
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

If you installed the package locally, for example from npm, then its simply:

```js
import { createC2pa } from 'c2pa';
```

Additionally, the `wasmSrc` and `workerSrc` objects need to available as static assets that can be fetched at runtime. The best way to do that depends on the build system.  For example, using [Vite](https://vite.dev/guide/assets#explicit-url-imports), as shown in the [minimal-ts-vite example](https://github.com/contentauth/c2pa-js/blob/main/examples/minimal-ts-vite/examples/active-manifest/main.ts):


```js
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.js?url';
import { parseISO } from 'date-fns';

(async () => {
  let output: string[] = [];

  const c2pa = await createC2pa({
    wasmSrc,
    workerSrc,
  });

  ...
  
})();
```