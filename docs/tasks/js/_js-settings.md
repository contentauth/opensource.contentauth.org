
In the browser, there is no `Context` class. You pass a **camelCase** [`Settings`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.Settings.html) object to [`createC2pa`](https://contentauth.github.io/c2pa-js/modules/_contentauth_c2pa-web.html#createc2pa); that becomes the default for new readers and builders. You can still pass a `Settings` object as the last argument to [`reader.fromBlob`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.ReaderFactory.html#fromblob) or [`builder.new`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#new) / [`fromDefinition`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromdefinition) / [`fromArchive`](https://contentauth.github.io/c2pa-js/interfaces/_contentauth_c2pa-web.BuilderFactory.html#fromarchive) to override those defaults for a single instance.

For the full JSON schema (including `version` and snake_case fields used by Rust tooling), see [SDK object reference — Settings](../../manifest/json-ref/settings-schema). The web SDK maps the camelCase `Settings` shape to what the Wasm layer expects.

### Default `createC2pa` settings

```typescript
import { createC2pa } from '@contentauth/c2pa-web';
import wasmSrc from '@contentauth/c2pa-web/resources/c2pa.wasm?url';

const settings = {
  verify: { verifyTrust: true },
  trust: {
    trustAnchors: 'https://example.com/trust_anchors.pem',
  },
  builder: { generateC2paArchive: true },
};

const c2pa = await createC2pa({ wasmSrc, settings });
```

### Load JSON from your origin

```typescript
const loaded = await fetch('/c2pa-settings.json').then((r) => r.json());
const c2pa = await createC2pa({ wasmSrc, settings: loaded });
```

Only fetch settings from origins you trust, over HTTPS.

Example `c2pa-settings.json` (camelCase keys as consumed by c2pa-web):

```json
{
  "verify": { "verifyTrust": true, "verifyAfterReading": true },
  "trust": {
    "trustAnchors": "https://example.com/trust_anchors.pem",
    "userAnchors": "https://example.com/user_anchors.pem"
  },
  "builder": { "generateC2paArchive": true }
}
```
