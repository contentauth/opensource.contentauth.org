# Technical FAQ topics for review

These editorial notes capture unresolved or time-sensitive topics from the
CAI Rust SDK Discord history covering April through October 2026. They are
not confirmed FAQ answers. Verify each topic before publishing guidance.
Discord source links may require channel access.

See the [Technical FAQ](./tech-faq-rust.md) for the nine drafted answers.

## Verification website reports invalid content that the SDK reports as trusted

**Candidate question:** Why does a verification website reject an asset
that the SDK reports as trusted?

The user reported that the SDK returned successful validation results and
a `Trusted` validation state. Support suspected incomplete website support
for update manifests or timestamp assertions and recommended checking with
the SDK or C2PA Tool. No website fix or support timeline was confirmed.

Before publication:

- Identify the affected verification website and version, if available.
- Confirm its current support for update manifests and timestamp assertions.
- Reproduce any remaining discrepancy with the same asset and trust settings.
- Do not present incomplete website support as the cause of every validation
  discrepancy.

[Source: initial guidance, April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491238678410821784)

[Source: SDK validation result, April 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1494485332010209350)

[Source: pending website support information, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495872312413655162)

## Server-side assertion validation with a remote signer

**Candidate question:** How can a remote signer validate assertion values
before signing without receiving the asset bytes?

Support suggested sending serialized assertions with the claim, checking
their hashes against the claim, and inspecting their contents. The user
reported difficulties accessing assertion salts through `AsyncSigner`.
No complete, confirmed implementation was provided.

The discussion also distinguished assertion integrity from the broader
security architecture of a distributed implementation. Questions about
whether the proposed architecture satisfied conformance requirements were
referred to the C2PA conformance program.

Before publication:

- Confirm the current APIs for accessing serialized assertions and salts.
- Develop and test a complete example of server-side assertion validation.
- Distinguish hash integrity checks from validation of assertion values.
- Obtain authoritative guidance on the applicable conformance requirements;
  do not infer that client authentication alone is sufficient.

[Source: proposed approach, August 10, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1536422380207996989)

[Source: API limitations, August 11, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1536634968212774962)

[Source: security architecture, August 11, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1536713305916440648)

[Source: conformance referral, August 17, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1538923231476457533)

## Rust SDK 1.0 release timeline

**Candidate question:** When will the Rust SDK reach 1.0?

On June 8, 2026, support said the team was not ready to share a timeline.
This is a dated roadmap response, not a permanent FAQ answer.

Before publication, check current release information and obtain an
approved roadmap statement from the team.

[Source: June 8, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1513639744167219280)

## Build failure caused by a yanked dependency

**Candidate question:** What should I do about the yanked dependency
build failure?

An October 16, 2026, announcement directed affected source builds to
upgrade to `c2pa-rs` 0.91.3 because of a yanked `zip` dependency. The
announcement named `zip` 8.6.0 and described 0.91.2 and earlier SDK
versions as affected. These details have not been independently verified.

Before publication:

- Verify the dependency version and the exact affected SDK releases.
- Confirm the first release containing the dependency update.
- Check how existing lockfiles affect reproducibility.
- Prefer a dated troubleshooting notice over an evergreen FAQ entry.

[Source: October 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1560738950807687341)

## Ingredient digital source type and remote-signer certificate chains

**Candidate questions:**

- Does the SDK support the ingredient `digitalSourceType` field?
- Has the remote signer's PEM certificate-chain parsing issue been fixed?

A contributor reported missing ingredient `digitalSourceType` support and
linked [PR #2078](https://github.com/contentauth/c2pa-rs/pull/2078) and
[issue #2077](https://github.com/contentauth/c2pa-rs/issues/2077).
The contributor also linked
[PR #2075](https://github.com/contentauth/c2pa-rs/pull/2075) for parsing a
remote signer's PEM certificate chain into individual DER certificates.
The export does not confirm merge or release status for either fix.

Before publication, verify each PR's status, identify the first release
containing the change, and test a minimal example of the reported behavior.
Treat these as separate FAQ entries if both remain useful.

[Source: ingredient field, May 4, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1500953348722131055)

[Source: certificate-chain parsing, May 4, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1500953982431133827)

## Building the C SDK for 32-bit Windows

**Candidate question:** How do I build the C SDK for 32-bit Windows?

A user reported receiving an x64 DLL when attempting to build the C SDK
for Win32 x86. No resolution appears in the export. The later resolution
of a C2PA Tool version mismatch does not resolve this separate build issue.

Before publication, confirm supported targets and toolchain requirements,
reproduce the build, and verify the architecture of the resulting DLL.

[Source: April 21, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1496248252767670272)
