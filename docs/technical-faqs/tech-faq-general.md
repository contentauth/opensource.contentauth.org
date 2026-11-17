---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# General FAQs

<TOCInline toc={toc} />

For questions about manifest creation, custom assertions, and validation states,
see the [Manifest FAQs](./tech-faq-manifests.md).

### Where can I find signed sample assets?

There are some signed sample assets in [Proofmode's Baseline repository](https://proofmode.org/baseline/). Many of these assets use older C2PA 1.x versions. There are also a few signed assets for testing in the
[`contentauth/example-assets` repository](https://github.com/contentauth/example-assets).
Neither repository provides a complete current conformance test suite.

<!--
Can we get interoperability assets from c2pa?  Tim to ask Scott.
Ask on Discord for contributions
-->

### How can I get started with Content Credentials on Android or iOS?

Use the [mobile libraries](../mobile.md) for Android and Swift (for iOS).

### Where can I report a CAI security concern?

The CAI open-source library is maintained in partnership with Adobe.
Report suspected vulnerabilities through Adobe's public
[Intigriti program](https://app.intigriti.com/programs/adobe/adobepublic/detail). C2PA is listed in the program for vulnerability disclosure but is 
not currently eligible for bounty rewards. Adobe also accepts reports for assets that are not bounty-eligible.

For more information on security issues, see [SECURITY.md in the Rust library](https://github.com/contentauth/c2pa-rs/blob/main/SECURITY.md).

### Why might an HEIC thumbnail not appear in Verify?

Signing and display are separate issues. If a thumbnail's format changes to
`application/octet-stream` during signing, use a v2 claim: set
`claim_version` to `2`, or omit it if your version defaults to v2.

Display also depends on browser support. As of September 2026,
`image/heic` thumbnails displayed in macOS Safari but not Chrome.
A correctly embedded thumbnail therefore did not display in every browser.
Check support in your target browsers; these observations are not a current
compatibility matrix.

Sources:

- [V2 claims and browser-dependent display; September 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544362081107578961)
- [Successful result; September 2, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544907804417064970)