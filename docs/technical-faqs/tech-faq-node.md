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

Choose labels that reflect your implementation; this is not a universal
conformance configuration. Assertions are gathered by default, except for
the hard binding, which is always created.

Use only **base assertion labels**, without version or instance suffixes.
For example, use `c2pa.ingredient`, not `c2pa.ingredient.v3`. The SDK
handles the version.

Update to the latest Node SDK release to avoid a bug in an earlier release.
The first release containing that fix is not identified here. An upgrade does not replace
the need to configure assertion placement.

Sources:

- [Assertion settings; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489395644274839582)
- [Release guidance; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489396659451592754)
- [Base labels; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489400012369694912)

### How do I configure signing-certificate and timestamp trust?

Load the C2PA Trust List and C2PA TSA Trust List, combine their PEM contents,
and enable both trust checks. With those PEM
strings already loaded as `c2paTrustList` and `c2paTsaTrustList`, pass the
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

This is a configuration excerpt, not a complete program: it assumes the
reader and builder bindings are imported and the PEM contents have been
fetched or read. It comes from the replacement package discussed above,
not the deprecated `c2pa-node` 0.5.26 API.

Sources:

- [Reader and builder trust settings; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
- [User confirmation; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

### Should I pass a PEM file path or its contents as trust anchors?

Pass the **PEM contents as a string**, not a file path. C2PA Tool's
`load_trust_resource()` is a convenience for loading PEM data from a path
or URL; do not assume that behavior applies to the Node SDK.

The `loadSettingsFromFile()` function loads the whole settings file; it
does not imply that an individual trust-anchor setting accepts a PEM path.

Supply PEM strings through `trust.trust_anchors`, as shown above. Changing
the input format does not necessarily resolve every trust failure.

Sources:

- [PEM contents; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490086610321145876)
- [Settings-file distinction; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490087412364218409)
- [C2PA Tool convenience method; April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490090813227536416)
- [Later PEM-string example; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)
