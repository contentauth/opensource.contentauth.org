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
`c2paTrustList` and `c2paTsaTrustList`, pass the
settings to both the reader and builder:

```js
const settings = {
  trust: {
    trust_anchors: c2paTrustList + c2paTsaTrustList,
  },
  verify: {
    verify_trust: true,
    verify_timestamp_trust: true,
  },
};

const reader = await Reader.fromAsset({ path: "photo.jpg" }, settings);
const builder = Builder.withJson({ title: "photo.jpg" }, settings);
```

This excerpt assumes that `Reader` and `Builder` are imported and that the
PEM contents have been fetched or read. It does not use the deprecated
`c2pa-node` 0.5.26 API.

Sources:

- [Reader and builder trust settings; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
- [User confirmation; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

### Should I pass a PEM file path or its contents as trust anchors?

Pass the PEM contents as a string, not a file path. C2PA Tool's
`load_trust_resource()` is a convenience for loading PEM data from a path
or URL; do not assume that behavior applies to the Node SDK.

The `loadSettingsFromFile()` function loads a complete settings file.
It does not make an individual trust-anchor setting accept a PEM path.

Supply PEM strings through `trust.trust_anchors`, as shown above.
If validation still reports a trust failure, inspect the validation results
for other causes.

Sources:

- [PEM contents; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490086610321145876)
- [Settings-file distinction; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490087412364218409)
- [C2PA Tool convenience method; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490090813227536416)
- [Later PEM-string example; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
