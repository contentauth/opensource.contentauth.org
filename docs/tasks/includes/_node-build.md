This is an example of how to assign a manifest to an asset and sign the claim using Node.js:

```ts
import { ManifestBuilder } from 'c2pa-node';

const manifest = new ManifestBuilder({
  claim_generator: 'my-app/1.0.0',
  format: 'image/jpeg',
  title: 'node_test_local_signer.jpg',
  assertions: [
    {
      label: 'c2pa.actions',
      data: {
        actions: [
          {
            action: 'c2pa.created',
          },
        ],
      },
    },
    {
      label: 'com.custom.my-assertion',
      data: {
        description: 'My custom test assertion',
        version: '1.0.0',
      },
    },
  ],
});
```

Use the `c2pa.sign()` method to sign an ingredient, either locally if you have a signing certificate and key available, or by using a remote signing API.

## Signing a stream

If you have an asset file's data loaded into a stream, you can use it to sign the asset

**NOTE**: Signing using a stream is currently supported only for `image/jpeg` and `image/png` data. For all other file types, use the [file-based approach](#signing-files) .

```ts
import { readFile } from 'node:fs/promises';
import { createC2pa, createTestSigner } from 'c2pa-node';

// read an asset into a buffer
const buffer = await readFile('to-be-signed.jpg');
const asset: Asset = { buffer, mimeType: 'image/jpeg' };

// build a manifest to use for signing
const manifest = new ManifestBuilder(
  {
    claim_generator: 'my-app/1.0.0',
    format: 'image/jpeg',
    title: 'buffer_signer.jpg',
    assertions: [
      {
        label: 'c2pa.actions',
        data: {
          actions: [
            {
              action: 'c2pa.created',
            },
          ],
        },
      },
      {
        label: 'com.custom.my-assertion',
        data: {
          description: 'My custom test assertion',
          version: '1.0.0',
        },
      },
    ],
  },
  { vendor: 'cai' },
);

// create a signing function
async function sign(asset, manifest) {
  const signer = await createTestSigner();
  const c2pa = createC2pa({
    signer,
  });

  const { signedAsset, signedManifest } = await c2pa.sign({
    asset,
    manifest,
  });
}

// sign
await sign(asset, manifest);
```

**Remote signing**

If you have access to a web service that performs signing, you can use it to sign remotely; for example:

```ts
import { readFile } from 'node:fs/promises';
import { fetch, Headers } from 'node-fetch';
import { createC2pa, SigningAlgorithm } from 'c2pa-node';

function createRemoteSigner() {
  return {
    type: 'remote',
    async reserveSize() {
      const url = `https://my.signing.service/box-size`;
      const res = await fetch(url);
      const data = (await res.json()) as { boxSize: number };
      return data.boxSize;
    },
    async sign({ reserveSize, toBeSigned }) {
      const url = `https://my.signing.service/sign?boxSize=${reserveSize}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/octet-stream',
        }),
        body: toBeSigned,
      });
      return res.buffer();
    },
  };
}

async function sign(asset, manifest) {
  const signer = createRemoteSigner();
  const c2pa = createC2pa({
    signer,
  });

  const { signedAsset, signedManifest } = await c2pa.sign({
    asset,
    manifest,
  });
}

const buffer = await readFile('to-be-signed.jpg');
const asset: Asset = { buffer, mimeType: 'image/jpeg' };

const manifest = new ManifestBuilder(
  {
    claim_generator: 'my-app/1.0.0',
    format: 'image/jpeg',
    title: 'buffer_signer.jpg',
    assertions: [
      {
        label: 'c2pa.actions',
        data: {
          actions: [
            {
              action: 'c2pa.created',
            },
          ],
        },
      },
      {
        label: 'com.custom.my-assertion',
        data: {
          description: 'My custom test assertion',
          version: '1.0.0',
        },
      },
    ],
  },
  { vendor: 'cai' },
);

await sign(asset, manifest);
```