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
