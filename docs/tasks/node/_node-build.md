Use the `Builder` and `LocalSigner` classes from `@contentauth/c2pa-node` to assemble manifest data and sign an asset.

### Create a builder

```typescript
import { Builder } from '@contentauth/c2pa-node';

// Default settings
const builder = Builder.new();

// With settings (JSON object or string; see [Settings](../settings.mdx))
const withSettings = Builder.new({
  builder: { generate_c2pa_archive: true },
});

// From an existing manifest definition (see manifest JSON reference)
const fromDefinition = Builder.withJson({
  claim_generator_info: [{ name: 'my-app', version: '1.0.0' }],
  title: 'My image',
  format: 'image/jpeg',
  assertions: [],
  resources: { resources: {} },
});
```

### Add assertions and resources

```typescript
builder.addAssertion('c2pa.actions', {
  actions: [{ action: 'c2pa.created' }],
});

await builder.addResource('resource://example/thumb', {
  buffer: thumbnailBytes,
  mimeType: 'image/jpeg',
});
```

### Sign with a local certificate and key

`LocalSigner.newSigner` takes the signing certificate (PEM), private key (PEM), algorithm (`es256`, `ps256`, `ed25519`, etc.), and an optional RFC 3161 timestamp URL.

```typescript
import { Builder, LocalSigner } from '@contentauth/c2pa-node';
import { readFile } from 'node:fs/promises';

const cert = await readFile('signer.pem');
const key = await readFile('signer.key');
const signer = LocalSigner.newSigner(cert, key, 'es256');

const builder = Builder.withJson({
  claim_generator_info: [{ name: 'my-app', version: '1.0.0' }],
  title: 'output.jpg',
  format: 'image/jpeg',
  assertions: [],
  resources: { resources: {} },
});

builder.setIntent('edit');

// Output to a file
builder.sign(signer, { path: 'input.jpg' }, { path: 'signed.jpg' });
```

### Sign to an in-memory buffer

Use a destination object with `buffer: null`; after `sign`, the signed asset bytes are written into `dest.buffer`.

```typescript
const dest: { buffer: Buffer | null } = { buffer: null };
builder.sign(signer, { path: 'input.jpg' }, dest);
const signedBytes = dest.buffer;
```

### Callback signing (`signAsync`)

For signing in hardware, a remote service, or other custom flows, use `CallbackSigner` and `signAsync`:

```typescript
import { Builder, CallbackSigner } from '@contentauth/c2pa-node';
import { readFile } from 'node:fs/promises';

const cert = await readFile('signer.pem');

const callbackSigner = CallbackSigner.newSigner(
  {
    alg: 'es256',
    certs: [cert],
    reserveSize: 1024,
  },
  async (data: Buffer) => {
    return customSign(data);
  },
);

const builder = Builder.new();
await builder.signAsync(
  callbackSigner,
  { path: 'input.jpg' },
  { path: 'signed.jpg' },
);
```

Replace `customSign` with your implementation that returns the detached signature bytes for the C2PA claim.

For identity assertions (CAWG), see `IdentityAssertionBuilder` and `IdentityAssertionSigner` in the [c2pa-node-v2 README](https://github.com/contentauth/c2pa-node-v2#identity-assertion-components).
