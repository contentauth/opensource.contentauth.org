Load settings as defined inline:

```js
import { createC2pa } from '@contentauth/c2pa-web';
// With Vite (or similar), this resolves to the hosted WASM binary URL:
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

const settings = {
  // Turn trust verification on/off (defaults to true)
  verify: { verifyTrust: true },

  // Configure trust (PEM text, a URL, or an array of URLs)
  trust: {
    // Example: load system trust anchors from a URL (PEM file)
    trustAnchors: 'https://example.com/trust_anchors.pem',
    // Optional user anchors (also PEM text or URLs)
    // userAnchors: '-----BEGIN CERTIFICATE-----\n...'
  },

  // Optional builder settings
  // builder: { generateC2paArchive: true },
};

const c2pa = await createC2pa({ wasmSrc, settings });

// Use the SDK (example: read an asset)
const res = await fetch('https://contentauth.github.io/example-assets/images/cloudscape-ACA-Cr.jpeg');
const blob = await res.blob();

const reader = await c2pa.reader.fromBlob(blob.type, blob);
const manifestStore = await reader.manifestStore();
console.log(manifestStore);

await reader.free();
c2pa.dispose();
```

To load settings from a JSON file:

```js
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

const settings = await fetch('/c2pa-settings.json').then(r => r.json());
const c2pa = await createC2pa({ wasmSrc, settings });
```

Where `c2pa-settings.json` is:

```js
{
  "verify": { "verifyTrust": true },
  "trust": {
    "trustAnchors": "https://example.com/trust_anchors.pem",
    "userAnchors": "https://example.com/user_anchors.pem"
  },
  "builder": { "generateC2paArchive": true }
}
```