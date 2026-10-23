---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# General FAQs

<TOCInline toc={toc} />

### Where can I find signed sample assets?

Use Proofmode's public
[Baseline repository](https://proofmode.org/baseline/) has signed sample
assets, but be aware that much of its content uses older C2PA 1.x support. Use the [`contentauth/example-assets` repository](https://github.com/contentauth/example-assets) to submit signed assets for testing. Neither repository guarantees a
complete, current conformance test suite.

For location metadata, see the Proofmode
[Android 3.0.2 release candidate](https://github.com/guardianproject/proofmode-android/releases/tag/3.0.2-RC-2)
and its use of `c2pa.metadata` to include geolocation as a created assertion.
Older conformance samples used `stds.exif`, described as deprecated but
still valid. See the
[Kotlin metadata-generation code](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt#L840).

Sources:

- [Baseline and older sample versions; April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489689553886384228)
- [Android geolocation implementation; April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489689681653141634)
- [Older sample assertion format; April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489690080623726795)
- [Metadata-generation code; April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489690402805125372)
- [Shared signed-asset repository; April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489693250133430272)

### How can I get started with Content Credentials on Android or iOS?

Use the [mobile SDKs](../mobile.md) for Android and iOS.

### Does a Valid validation state mean that the signer is trusted?

No. There are three manifest states:
**well-formed**, **valid**, and **trusted**. Trusted manifests are also
valid, and valid manifests are also well-formed. The reverse does not follow.

A manifest signed with a test certificate can have a `Valid` state while
`validation_results.activeManifest.failure` contains
`signingCredential.untrusted`. This follows the manifest-state model.

Do not label a manifest trusted merely because its state is `Valid`.
Inspect the trust-related validation results, and distinguish trust that
was not evaluated from a failed trust check. An issuer name alone does
not establish trust.

See the
[manifest states specification](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_manifest_states).

Sources:

- [Valid-but-untrusted result; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)
- [State hierarchy; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378030276612178)
- [Specification reference; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378218420633610)

### Can a manifest carry custom sensor or verification information?

Yes. You can add custom assertions to a C2PA manifest. A validator
that understands that assertion could use its information to identify where
changes occurred.

That is an extensibility mechanism, not endorsement of the proposal's
claimed security guarantees or a promise that existing validators understand
it. A camera/editor workflow needs compatible implementations; custom
assertions alone do not provide that coordination.

Source: [custom assertions and validator support, April 20, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1495831402938110155)

### Where are embedding rules for TIFF-based and base-media file formats documented?

See the **Embedded Formats annex**
of the
[Content Credentials specification](https://c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html).
for embedding rules relevant to TIFF-based Sony formats and the
base-media-based Canon CR3 format.

This is a specification pointer, not confirmation that every raw camera
format is supported by a particular SDK or that camera samples are available.

Source: [Embedded Formats annex, August 17, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1538922552007589898)

### Where can I report a CAI security concern?

Use the [CAI contact form](https://contentauthenticity.org/contact) to report
a security concern. Do not assume a dedicated security inbox, a response
deadline, or public status updates are available.

Sources:

- [Reporting contact; October 19, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1561895003670716528)
- [Routing and status limitations; October 19, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1561895701028536405)

### Why might an HEIC thumbnail not appear in Verify?

Signing and display are separate issues. If a thumbnail's format changes to
`application/octet-stream` during signing, use a v2 claim: set
`claim_version` to `2`, or omit it if your version defaults to v2.

Display also depends on browser support. As of September 2026,
`image/heic` thumbnails displayed in macOS Safari but not Chrome.
A correctly embedded thumbnail therefore did not guarantee display in
every browser. These observations are historical, not a current browser
compatibility matrix.

Sources:

- [V2 claims and browser-dependent display; September 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544362081107578961)
- [Successful result; September 2, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544907804417064970)