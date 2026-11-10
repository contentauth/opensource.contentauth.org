---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Node.js library FAQs

<TOCInline toc={toc} />

### How do I configure created versus gathered assertions?

Use `builder.created_assertion_labels` to identify the assertions attributed
to your claim generator. For example:

```js
const settings = {
  builder: {
    created_assertion_labels: [
      "c2pa.actions",
      "c2pa.thumbnail.claim",
      "c2pa.thumbnail.ingredient",
      "c2pa.ingredient"
    ]
  }
};
```

Choose labels that reflect your implementation; the example is not a universal
conformance configuration. Assertions are gathered by default, except for
the hard binding, which is always created.

Use only base assertion labels, without version or instance suffixes.
For example, use `c2pa.ingredient`, not `c2pa.ingredient.v3`. The SDK
handles the version.

An April 2026 support response recommended updating the Node.js SDK to resolve
an assertion-placement bug. The response did not identify the first release
containing the fix. Update to the latest release, but continue to configure
assertion placement explicitly.

Sources:

- [Assertion settings; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489395644274839582)
- [Release guidance; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489396659451592754)
- [Base labels; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489400012369694912)

### How do I configure signing-certificate and timestamp trust?

Load the C2PA Trust List and C2PA TSA Trust List, combine their PEM contents,
and enable both trust checks. After loading the PEM contents as
`c2paTrustList` and `c2paTsaTrustList`, attach the settings to a `Context`
and pass that context to both the reader and builder:

```js
import { Builder, Context, Reader } from "@contentauth/c2pa-node";

const context = new Context({
  trust: {
    trustAnchors: c2paTrustList + c2paTsaTrustList,
  },
  verify: {
    verifyTrust: true,
    verifyTimestampTrust: true,
  },
});

const reader = await Reader.fromAsset({ path: "photo.jpg" }, context);
const builder = await Builder.withJsonAsync({ title: "photo.jpg" }, context);
```

This excerpt assumes that the PEM contents have been fetched or read.
`Context` settings use camelCase keys. Use the asynchronous
`Builder.withJsonAsync()` factory rather than the deprecated synchronous
`Builder.withJson()` method.

Sources:

- [Reader and builder trust settings; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
- [User confirmation; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

### Should I pass a PEM file path or its contents as trust anchors?

You can pass the PEM contents as a string or a file path.

The `loadSettingsFromFile()` function loads a complete settings file.
It does not make an individual trust-anchor setting accept a PEM path.

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
