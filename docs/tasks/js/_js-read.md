
Once you've used [`createC2pa`](https://contentauth.github.io/c2pa-js/functions/_contentauth_c2pa-web.index.createC2pa.html) to create an instance of c2pa-web (for example in `c2pa` in this example), use `c2pa.reader.fromBlob()` to create a [Reader](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.index.Reader.html) for an asset.

Then use Reader's [`manifestStore()` method](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.index.Reader.html#manifeststore) to read manifest data (if any) from the asset.

For example:

```js
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';
const c2pa = createC2pa({ wasmSrc });

const response = await fetch(
  'https://contentauth.github.io/example-assets/images/Firefly_tabby_cat.jpg'
);

const blob = await response.blob();
const reader = await c2pa.reader.fromBlob(blob.type, blob);
const manifestStore = await reader.manifestStore();

console.log(manifestStore);

// Free SDK objects when they are no longer needed to avoid memory leaks.
await reader.free();
```
