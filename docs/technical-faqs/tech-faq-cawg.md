# CAWG Standard FAQs

These answers are based on the 41 messages in the exported CAI CAWG Standard
Discord history, covering May 1 through October 16, 2026. The export supports
five useful answered topics, selected for actionable guidance rather than
a measured frequency ranking.

Version, implementation, and trust-model information reflect those
discussions and have not been independently checked against the latest
releases or external sources. Discord source links may require server
membership and channel access.

Selected answers also draw on the General channel history from April through
October 2026, with the same source-only, unverified status.

## Does c2pa-rs support identity claims aggregation?

The August 14 support answer confirms CAWG identity claims aggregation
(ICA) support in `c2pa-rs` and reports an implementation using the Node
bindings. The implementer still needs to provide an aggregation service
that returns the COSE-signed verifiable credential; SDK support does not
supply that service.

The answer links the Rust
[identity module](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity)
and its
[tests](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity/tests).
It does not confirm equivalent ICA support in the Swift or Python SDKs.

[Source: Rust and Node ICA support and service responsibilities, August 14, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1537963403539390495)

## How can I inspect CAWG certificate fields when common_name is missing?

In May, support described using crJSON to inspect certificate issuer and
subject information when the ordinary CAWG signature report omitted
`common_name`:

```sh
c2patool signed.jpg --crjson
```

The example places these fields under
`cawg.identity.signature.certificateInfo`, including `issuer`, `subject`,
and certificate validity dates. The follow-up confirmed that the common
name was visible through `--crjson`.

This is a reporting workaround for the issue discussed at that time, not
evidence that the missing field has since been fixed. Reading a certificate
subject also does not establish that its identity is trusted.

[Source: crJSON workaround, May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502369680118124555)

[Source: certificate field structure, May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502369868396367913)

[Source: workaround confirmation, May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502377614436995162)

## Does a CAWG identity certificate need to chain to the C2PA Trust List?

The August support answer distinguishes the two trust models. The C2PA
Trust List contains roots for claim-signing certificates issued to generator
products that have passed C2PA Conformance. CAWG X.509 identity certificates
use a different model.

The answer describes CAWG's **interim** model at that time as using the
Mozilla Root Store and IPTC verified news publisher lists, and links
the [CAWG identity 1.3 X.509 trust model](https://cawg.io/identity/1.3/#_trust_model_for_x_509_certificates).
It also provides the
[Mozilla email-trust roots](https://ccadb.my.salesforce-sites.com/mozilla/IncludedRootsPEMTxt?TrustBitsInclude=Email)
and the IPTC
[end-entity](https://trust.iptc.org/end-entity-list.pem) and
[anchor](https://trust.iptc.org/anchor-list.pem) lists.

Do not equate C2PA product trust with CAWG identity trust, or treat the
historical interim model as an independently verified current policy.

An April General-channel answer describes S/MIME certificates as a common
CAWG X.509 choice, including individual-validated, sponsor-validated, and
organization-validated certificates. Having a government-issued identity
certificate does not by itself answer whether it meets CAWG's requirements;
check the CAWG X.509 trust model rather than the C2PA product Trust List.
The reply did not determine whether the questioner's particular certificate
qualified.

[Source: distinct C2PA and CAWG X.509 trust models, August 20, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1540009285424119868)

[Source: CAWG certificate types and separate identity role, April 1, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1488868534166749375)

## Why can CAWG identity remain untrusted when the claim signer is trusted?

CAWG trust anchors need separate SDK configuration. Trust in the C2PA claim
signer does not automatically establish trust in the identity assertion.
The August troubleshooting answer identifies two possible causes: no CAWG
anchors configured by the validator, or a CAWG certificate that does not
chain to the anchors that validator uses.

Inspect the validation result's assertion URL to determine whether
`signingCredential.untrusted` refers to `cawg.identity` rather than the claim
signature. A successful signature or well-formedness check is not a
substitute for the identity trust check.

In September, a fix was reported merged to make the supplied CAWG trust
lists usable by `c2pa-rs` and C2PA Tool. A later test in the same discussion
confirmed that one SSL.com CAWG certificate showed as trusted when the
Mozilla Root Store was configured. That result is specific to the tested
certificate and configuration. It does not show that every validator ships
those anchors, that every certificate from that issuer is trusted, or which
released tool version first included the fix.

An earlier workaround manually trusted individual leaf certificates.
That local workaround is not evidence that other certificates sharing a
root will be trusted, nor does it define an authoritative CAWG trust policy.

[Source: possible validator configuration causes, August 24, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1541459686690267136)

[Source: separate configuration and local leaf workaround, September 7, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1546545082130370620)

[Source: merged trust-list fix report, September 10, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1547575185790603264)

[Source: configured-root test result, September 10, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1547641280048275550)

## Are there source-linked guides for CAWG on mobile?

The October 16 announcement reports CAWG X.509 support for captured photos
and videos in a Proofmode Android release. It links a
[user guide](https://proofmode.org/cawg_user_guide) describing a workflow
using SSL.com identity-validated certificates.

A companion message links the
[CAWG mobile SDK developer guide](https://opensource.contentauthenticity.org/docs/cawg-mobile).
These are resources shared in the export, not independently reviewed
instructions or a guarantee of support across all mobile SDKs, certificate
authorities, or identity mechanisms.

[Source: Android implementation and user guide announcement, October 16, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1560673010854264932)

[Source: mobile developer guide, October 16, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1560673133684457494)

## What should I use instead of CreativeWork for creator-related data?

For the manifest reviewed on August 31, support recommended CAWG assertions
instead of `stds.schema-org.CreativeWork`, pointing to the CAWG identity
assertion and CAWG metadata assertion at [cawg.io](https://cawg.io).

This is a recommendation about representing the data in that workflow, not
a claim that switching assertion labels automatically verifies an identity
or makes a signing certificate trusted. Identity trust must still be
evaluated separately.

[Source: CAWG identity and metadata recommendation, August 31, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1543982994082238568)
