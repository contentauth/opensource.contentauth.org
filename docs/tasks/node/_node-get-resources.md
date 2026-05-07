Binary resources (thumbnails, icons, linked manifest blobs) are referenced by URI strings in the active manifest. Use `Reader.resourceToAsset` to copy a resource to a file path or to a buffer.

### Write a resource to a file

```javascript
import { Reader } from '@contentauth/c2pa-node';
import path from 'node:path';

async function writeThumbnail(assetPath, outputPath) {
  const reader = await Reader.fromAsset({ path: assetPath });
  if (!reader) {
    throw new Error('No C2PA manifest found for this asset.');
  }

  const manifest = reader.getActive();
  const uri = manifest?.thumbnail?.identifier;
  if (!uri) {
    throw new Error('Active manifest has no thumbnail.');
  }

  await reader.resourceToAsset(uri, { path: path.resolve(outputPath) });
}
```

### Read a resource into a buffer

Pass a destination object with `buffer: null`. 

```javascript
import { Reader } from '@contentauth/c2pa-node';

async function readResourceToBuffer(assetPath, uri) {
  const reader = await Reader.fromAsset({ path: assetPath });
  if (!reader) {
    throw new Error('No C2PA manifest found.');
  }

  const { buffer } = await reader.resourceToAsset(uri, { buffer: null });
  if (!buffer || buffer.length === 0) {
    throw new Error('Resource could not be read.');
  }
  return buffer;
}
```

### Discover URIs from JSON

You can inspect `reader.json()` for the full manifest store, or use `getActive()` for the active manifest only. Ingredient thumbnails use the same `identifier` pattern as the claim thumbnail.

```javascript
import { Reader } from '@contentauth/c2pa-node';

const reader = await Reader.fromAsset({ path: 'signed.jpg' });
if (!reader) {
  process.exit(0);
}

const store = reader.json();
console.log(JSON.stringify(store, null, 2));

const active = reader.getActive();
for (const ing of active?.ingredients ?? []) {
  if (ing.thumbnail?.identifier) {
    console.log('Ingredient thumbnail URI:', ing.thumbnail.identifier);
  }
}
```
