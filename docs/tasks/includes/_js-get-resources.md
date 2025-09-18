:::note
That JavaScript library is being extensively revised so the APIs used here may change in the near future.
:::

The example below shows how to get resources from manifest data using the JavaScript library.

```js
const version = '0.27.1';
const sampleImage = 'my_image.jpg'

import { createC2pa, selectProducer } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.js?url';
import { parseISO } from 'date-fns';
import { createC2pa } from 'https://cdn.jsdelivr.net/npm/c2pa@${version}/+esm';

(async () => {
  // Initialize the c2pa-js SDK
  const c2pa = await createC2pa({
    wasmSrc:
      'https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/assets/wasm/toolkit_bg.wasm',
    workerSrc:
      'https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/c2pa.worker.min.js',
  });

  
  let output: string[] = [];

  const c2pa = await createC2pa({
    wasmSrc,
    workerSrc,
  });

  const { manifestStore, source } = await c2pa.read(sampleImage);
  const activeManifest = manifestStore?.activeManifest;
  if (activeManifest) {
    // Get thumbnail
    // Note: You would normally call `dispose()` when working with a
    // component-based UI library (e.g. on component un-mount)
    // @ts-expect-error noUnusedLocals
    const { url, dispose } = source.thumbnail.getUrl();

    // Get properties
    const properties: Record<string, string | undefined> = {
      title: activeManifest.title,
      format: activeManifest.format,
      claimGenerator: activeManifest.claimGenerator.split('(')[0]?.trim(),
      producer: selectProducer(activeManifest)?.name ?? 'Unknown',
      thumbnail: `<img src="${url}" class="thumbnail" />`,
      ingredients: (activeManifest.ingredients ?? [])
        .map((i) => i.title)
        .join(', '),
      signatureIssuer: activeManifest.signatureInfo?.issuer,
      signatureDate: activeManifest.signatureInfo?.time
        ? parseISO(activeManifest.signatureInfo.time).toString()
        : 'No date available',
    };

    output = Object.keys(properties).map((key) => {
      return `
        <tr>
          <td>${key}</td>
          <td>${properties[key]}</td>
        </tr>
      `;
    });

  } else {
    output.push(`
      <tr>
        <td colspan="2">No provenance data found</td>
      </tr>
    `);
  }

  document.querySelector('#results tbody')!.innerHTML = output.join('');
  
})();
```

With an HTML page like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg" />
    <link rel="stylesheet" href="../../styles.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>active-manifest</title>
  </head>
  <body>
    <table id="results">
      <thead>
        <th>Property</th>
        <th>Value</th>
      </thead>
      <tbody>
        <td colspan="3">Loading&hellip;</td>
      </tbody>
    </table>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```