
Use the `c2pa.read()` function to read a manifest; for example:

```ts
import { createC2pa } from 'c2pa-node';
import { readFile } from 'node:fs/promises';

const c2pa = createC2pa();

async function read(path, mimeType) {
  const buffer = await readFile(path);
  const result = await c2pa.read({ buffer, mimeType });

  if (result) {
    const { active_manifest, manifests, validation_status } = result;
    console.log(active_manifest);
  } else {
    console.log('No claim found');
  }
  // If there are no validation errors, then validation_status will be an empty array
}

await read('my-c2pa-file.jpg', 'image/jpeg');
```
