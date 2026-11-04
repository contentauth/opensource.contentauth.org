---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# General FAQs

<TOCInline toc={toc} />

### Where can I find signed sample assets?

There are some signed sample assets in [Proofmode's Baseline repository](https://proofmode.org/baseline/). Many of these assets use
older C2PA 1.x versions. There are also a few signed assets for testing in the
[`contentauth/example-assets` repository](https://github.com/contentauth/example-assets).
Neither repository provides a guaranteed complete, current conformance test suite.

### How can I get started with Content Credentials on Android or iOS?

Use the [mobile SDKs](../mobile.md) for Android and iOS.

### Does a 'Valid' validation state mean that the signer is trusted?

No. The three manifest states are
**well-formed**, **valid**, and **trusted**. Trusted manifests are also
valid, and valid manifests are also well-formed. The reverse does not follow.

A manifest signed with a test certificate can have a `Valid` state while
`validation_results.activeManifest.failure` contains
`signingCredential.untrusted`.

Do not label a manifest trusted merely because its state is `Valid`.
Inspect the trust-related validation results, and distinguish trust that
was not evaluated from a failed trust check. An issuer name alone does
not establish trust.

For details, see the
[C2PA specification](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_manifest_states).

Sources:

- [Valid-but-untrusted result; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)
- [State hierarchy; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378030276612178)
- [Specification reference; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378218420633610)

### Can a manifest carry custom sensor or verification information?

Yes. Add custom assertions to a C2PA manifest to carry sensor or verification
information. A validator that supports the assertion can use that information
to identify where changes occurred.

Custom assertions require compatible implementations in both the camera or
editor and the validator. Existing validators might not support them, and
adding an assertion does not by itself establish the security guarantees of
the proposed workflow.

Source: [custom assertions and validator support, April 20, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1495831402938110155)

### Where are embedding rules for TIFF-based and base-media file formats documented?

See the Embedded Formats annex of the
[Content Credentials specification](https://c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html)
for embedding rules for TIFF-based Sony formats and the Canon CR3 format,
which is based on the ISO base media file format.

These rules do not imply that a particular SDK supports every raw camera
format or that sample assets are available.

Source: [Embedded Formats annex, August 17, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1538922552007589898)

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