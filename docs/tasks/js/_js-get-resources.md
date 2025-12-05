The example below shows how to get resources from manifest data using the JavaScript library.

```js
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';
const c2pa = createC2pa({ wasmSrc });

const response = await fetch(
  'https://contentauth.github.io/example-assets/images/Firefly_tabby_cat.jpg'
);

const blob = await response.blob();
const reader = await c2pa.reader.fromBlob(blob.type, blob);

...
```

More TBD.

