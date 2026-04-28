
Use the `Reader` class to read C2PA manifest data from a file or buffer. For example:

```ts
// read-manifest.ts
import { Reader } from '@contentauth/c2pa-node';

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: ts-node read-manifest.ts <path-to-asset>');
    process.exit(1);
  }

  const reader = await Reader.fromAsset({ path: inputPath });
  if (!reader) {
    console.log('No C2PA manifest found.');
    return;
  }

  const manifestStore = reader.json();
  console.log(JSON.stringify(manifestStore, null, 2));

  // If you only want the active manifest:
  const active = reader.getActive();
  if (active) {
    console.log('Active manifest label:', manifestStore.active_manifest);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Using a buffer

```ts
import fs from 'node:fs/promises';
import { Reader } from '@contentauth/c2pa-node';

async function readFromBuffer(filePath: string): Promise<void> {
  const buffer = await fs.readFile(filePath);
  const reader = await Reader.fromAsset({
    buffer,
    mimeType: 'image/jpeg',
  });
  if (!reader) {
    console.log('No C2PA manifest found.');
    return;
  }
  console.log(JSON.stringify(reader.json(), null, 2));
}
```