The Node.js library does not expose a `Context` type. Instead, you pass **per-instance** settings: a JavaScript object, a JSON string, or file contents (JSON or TOML) from `loadSettingsFromFile`, as the second argument to `Reader.fromAsset`, `Reader.fromManifestDataAndAsset`, `Builder.new`, `Builder.withJson`, or `Builder.fromArchive`.

For the full settings schema, see [SDK object reference — Settings](../../manifest/json-ref/settings-schema).

### Inline settings

```typescript
import { Reader } from '@contentauth/c2pa-node';

const settings = {
  verify: {
    verify_after_reading: false,
    verify_trust: true,
  },
};

const reader = await Reader.fromAsset({ path: 'image.jpg' }, settings);
```

`Builder` accepts the same shape (or a JSON string):

```typescript
import { Builder } from '@contentauth/c2pa-node';

const builder = Builder.new({
  builder: { generate_c2pa_archive: true },
});
```

### Helper functions

Use the helpers from `@contentauth/c2pa-node` to build typed fragments, merge them, and serialize to JSON (camelCase keys are converted to snake_case for the Rust-backed SDK):

```typescript
import {
  Builder,
  Reader,
  createTrustSettings,
  createCawgTrustSettings,
  createVerifySettings,
  mergeSettings,
  settingsToJson,
  loadSettingsFromFile,
  loadSettingsFromUrl,
} from '@contentauth/c2pa-node';

const trustSettings = createTrustSettings({
  verifyTrustList: true,
  userAnchors: 'path/to/user-anchors.pem',
  trustAnchors: 'path/to/trust-anchors.pem',
  allowedList: 'path/to/allowed-list.pem',
});

const cawgTrustSettings = createCawgTrustSettings({
  verifyTrustList: true,
  trustAnchors: 'path/to/cawg-anchors.pem',
});

const verifySettings = createVerifySettings({
  verifyAfterReading: false,
  verifyAfterSign: false,
  verifyTrust: true,
  verifyTimestampTrust: true,
  ocspFetch: true,
  remoteManifestFetch: true,
  skipIngredientConflictResolution: false,
  strictV1Validation: false,
});

const combined = mergeSettings(trustSettings, verifySettings, cawgTrustSettings);
const asJson = settingsToJson(combined);
```

### Load settings from a file or URL

```typescript
import { Reader, Builder, loadSettingsFromFile, loadSettingsFromUrl } from '@contentauth/c2pa-node';

const fileSettings = await loadSettingsFromFile('./c2pa-settings.toml');
const reader = await Reader.fromAsset({ path: 'image.jpg' }, fileSettings);

const urlSettings = await loadSettingsFromUrl('https://example.com/c2pa-settings.json');
const builder = Builder.new(urlSettings);
```

Only use HTTPS URLs you trust for `loadSettingsFromUrl`.
