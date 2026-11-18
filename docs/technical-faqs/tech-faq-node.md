---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Node.js library FAQs

<TOCInline toc={toc} />

### How do I configure signing-certificate and timestamp trust?

Attach the settings to a `Context` and pass it to both the `Reader` and `Builder` objects:

```js
import { Builder, Context, Reader } from "@contentauth/c2pa-node";

const context = new Context({
  verify: {
    verifyAfterReading: false,
    verifyAfterSign: false,
    verifyTrust: true,
    ocspFetch: true
  },
  trust: {
    verifyTrustList: true,
    trustAnchors: "path/to/anchors.pem"
  }
});

const reader = await Reader.fromAsset({ path: "photo.jpg" }, context);
const builder = await Builder.withJsonAsync({ title: "photo.jpg" }, context);
```

This excerpt assumes that the PEM contents have been fetched or read.
`Context` settings use camelCase keys. 

For more information, see [Node.js library - Identity assertion components](../sdk-repos/c2pa-js/packages/c2pa-node/README.md#identity-assertion-components).

### Should I pass a PEM file path or its contents as trust anchors?

<!-- 
Combine with this Q?
* How do I configure trust for ingredient validation? tech-faq-certificates.md#how-do-i-configure-trust-for-ingredient-validation 
* Can I configure trust anchors using a URL? tech-faq-rust.md #can-i-configure-trust-anchors-using-a-url
-->

You can pass the PEM contents as a string or a file path.

The `loadSettingsFromFile()` function loads a complete settings file.
It does not make an individual trust-anchor setting accept a PEM path.

For settings-loading examples and helper functions, see the Node.js tab in
[Configuring SDK settings](../tasks/settings.mdx?lang=node).

For a local PEM file, read its contents in your application:

```js
import { readFile } from "node:fs/promises";

const pem = await readFile("path/to/trust_anchors.pem", "utf8");
```

Alternatively, supply an inline PEM string:

```js
const pem = `-----BEGIN CERTIFICATE-----
...base64-encoded certificate data...
-----END CERTIFICATE-----`;
```

Replace the placeholder with your complete PEM certificate data. In either
case, assign the PEM contents to `trust.trustAnchors` in a `Context`:

```js
const context = new Context({
  trust: {
    trustAnchors: pem,
  },
  verify: {
    verifyTrust: true,
    verifyTimestampTrust: true,
  },
});
```

Pass this context to the reader and builder as shown above. When checking
both signing-certificate and timestamp trust, include both trust lists'
PEM contents.

If validation still reports a trust failure, inspect the validation results
for other causes.

Sources:

- [PEM contents; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490086610321145876)
- [Settings-file distinction; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490087412364218409)
- [C2PA Tool convenience method; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490090813227536416)
- [Later PEM-string example; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
