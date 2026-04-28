### Setting the intent

In Node.js, call `setIntent` on a `Builder` from `@contentauth/c2pa-node`. The intent shapes validation, default actions, and whether a parent ingredient is required.

```typescript
import { Builder } from '@contentauth/c2pa-node';

const builder = Builder.new();

// Runtime intent (Create, Edit, or Update)
builder.setIntent({
  create:
    'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
});
```

You can also set `edit` or `update` with a string:

```typescript
builder.setIntent('edit');
builder.setIntent('update');
```

### Create intent

Use a `create` intent for new digital creations. You must supply a [digital source type](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_digital_source_type) URI. The manifest must not have a parent ingredient; the SDK can add a `c2pa.created` action when appropriate.

```typescript
import { Builder, LocalSigner } from '@contentauth/c2pa-node';
import { readFile } from 'node:fs/promises';

const builder = Builder.new();
builder.setIntent({
  create:
    'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
});

const signer = LocalSigner.newSigner(
  await readFile('signer.pem'),
  await readFile('signer.key'),
  'es256',
);

builder.sign(
  signer,
  { path: 'source.jpg' },
  { path: 'signed.jpg' },
);
```

### Edit intent

Use `edit` when modifying existing content. If you do not add a parent ingredient, one can be created from the source asset you pass to `sign`.

```typescript
import { Builder } from '@contentauth/c2pa-node';

const builder = Builder.new();
builder.setIntent('edit');
```

To supply the parent explicitly, add an ingredient JSON string and optional asset buffer (see [Adding manifest data](../build.mdx)):

```typescript
import { Builder } from '@contentauth/c2pa-node';
import { readFile } from 'node:fs/promises';

const builder = Builder.new();
builder.setIntent('edit');

const parentJson = JSON.stringify({
  title: 'Original Photo',
  relationship: 'parentOf',
  format: 'image/jpeg',
});

await builder.addIngredient(parentJson, {
  buffer: await readFile('original.jpg'),
  mimeType: 'image/jpeg',
});
```

### Update intent

Use `update` for restricted, metadata-oriented changes: typically a single parent ingredient and no changes to the parent’s hashed content.

```typescript
import { Builder } from '@contentauth/c2pa-node';

const builder = Builder.new();
builder.setIntent('update');
```

For more detail on intent semantics, see the [c2pa-rs `Builder` documentation](https://docs.rs/c2pa/latest/c2pa/struct.Builder.html).
