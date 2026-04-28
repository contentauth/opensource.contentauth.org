### Setting the intent

The snippets below use `c2pa` from `const c2pa = await createC2pa({ wasmSrc });` (see [Reading and verifying manifest data](../read.mdx)).

Call [`setIntent`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#setintent) on a builder from `c2pa.builder`. Intents match the same **Create** / **Edit** / **Update** semantics as other CAI SDKs (see the table on this page).

```typescript
const builder = await c2pa.builder.new();

await builder.setIntent({
  create:
    'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
});

await builder.setIntent('edit');

await builder.setIntent('update');
```

### Create intent

Use `create` with a [digital source type](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_digital_source_type) URI. There must be no parent ingredient; the SDK may add `c2pa.created` when appropriate.

```typescript
const builder = await c2pa.builder.new();

await builder.setIntent({
  create:
    'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
});
// Add assertions, thumbnail, then sign (see [Build](../build.mdx)).
```

### Edit intent

Use `edit` when changing pixel or editorial content. If you do not add a parent ingredient, one can be derived from the source blob you pass to [`sign`](../build.mdx).

```typescript
const builder = await c2pa.builder.new();
await builder.setIntent('edit');
```

Add a parent explicitly with [`addIngredientFromBlob`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Builder.html#addingredientfromblob):

```typescript
const parentBlob = await fetch('/original.jpg').then((r) => r.blob());
const builder = await c2pa.builder.new();
await builder.setIntent('edit');

await builder.addIngredientFromBlob(
  {
    title: 'Original Photo',
    relationship: 'parentOf',
    format: 'image/jpeg',
  },
  parentBlob.type,
  parentBlob,
);
```

### Update intent

Use `update` for restricted, metadata-oriented edits (single parent ingredient, no change to the parent’s hashed payload per C2PA rules).

```typescript
const builder = await c2pa.builder.new();
await builder.setIntent('update');
```

More background: [c2pa-rs `Builder`](https://docs.rs/c2pa/latest/c2pa/struct.Builder.html) and the [c2pa-web README](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-web#setting-builder-intent).
