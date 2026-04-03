```ts
import {
  createTrustSettings,
  createCawgTrustSettings,
  createVerifySettings,
  mergeSettings,
  settingsToJson,
  loadSettingsFromFile,
  loadSettingsFromUrl
} from '@contentauth/c2pa-node';

// Create trust settings
const trustSettings = createTrustSettings({
  verifyTrustList: true,
  userAnchors: "path/to/user-anchors.pem",
  trustAnchors: "path/to/trust-anchors.pem",
  allowedList: "path/to/allowed-list.pem"
});

// Create CAWG trust settings
const cawgTrustSettings = createCawgTrustSettings({
  verifyTrustList: true,
  trustAnchors: "path/to/cawg-anchors.pem"
});

// Create verify settings
const verifySettings = createVerifySettings({
  verifyAfterReading: false,
  verifyAfterSign: false,
  verifyTrust: true,
  verifyTimestampTrust: true,
  ocspFetch: true,
  remoteManifestFetch: true,
  skipIngredientConflictResolution: false,
  strictV1Validation: false
});

// Merge multiple settings
const combinedSettings = mergeSettings(trustSettings, verifySettings);

// Convert settings to JSON string
const jsonString = settingsToJson(combinedSettings);

// Load settings from file (JSON or TOML)
const fileSettings = await loadSettingsFromFile('./c2pa-settings.toml');
const reader = await Reader.fromAsset(inputAsset, fileSettings);

// Load settings from URL
const urlSettings = await loadSettingsFromUrl('https://example.com/c2pa-settings.json');
const builder = Builder.new(urlSettings);
```