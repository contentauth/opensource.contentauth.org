
After you obtain a [`Reader`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html), use [`resourceToBytes(uri)`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html#resourcetobytes) to resolve a JUMBF URI from the manifest (for example `activeManifest.thumbnail.identifier`) into raw bytes.

### Thumbnail from the active manifest

```typescript
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

const c2pa = await createC2pa({ wasmSrc });

const response = await fetch('/signed-image.jpg');
const blob = await response.blob();

const reader = await c2pa.reader.fromBlob(blob.type, blob);
if (!reader) {
  c2pa.dispose();
  return;
}

const active = await reader.activeManifest();
const uri = active.thumbnail?.identifier;
if (!uri) {
  await reader.free();
  c2pa.dispose();
  return;
}

const bytes = await reader.resourceToBytes(uri);
const thumbBlob = new Blob([bytes], {
  type: active.thumbnail?.format ?? 'image/jpeg',
});
const thumbUrl = URL.createObjectURL(thumbBlob);

await reader.free();
c2pa.dispose();
```

### Ingredient resources

Ingredients can expose their own `thumbnail` or other resource references. Inspect `active.ingredients` (or the full [`manifestStore`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Reader.html#manifeststore)) and pass each `identifier` string to `resourceToBytes`.

```typescript
const store = await reader.manifestStore();
const label = store.active_manifest;
const manifest = label ? store.manifests[label] : undefined;

for (const ing of manifest?.ingredients ?? []) {
  if (ing.thumbnail?.identifier) {
    const data = await reader.resourceToBytes(ing.thumbnail.identifier);
    // use data (Uint8Array)
  }
}
```
