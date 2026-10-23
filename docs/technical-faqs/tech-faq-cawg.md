---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# CAWG identity FAQs

<TOCInline toc={toc} />

### Does c2pa-rs support identity claims aggregation?

Yes. `c2pa-rs` supports CAWG identity claims aggregation (ICA), with an
implementation also using the Node bindings. You still need to provide an aggregation service that returns the COSE-signed verifiable credential; SDK support does not
supply that service.

See the Rust [identity module](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity)
and its [tests](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity/tests).
Equivalent ICA support in the Swift or Python SDKs is not confirmed here.

Source: [Rust and Node ICA support and service responsibilities; August 14, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1537963403539390495)

### How can I inspect CAWG certificate fields when common_name is missing?

Use crJSON to inspect certificate issuer and subject information when
the ordinary CAWG signature report omits `common_name`:

```sh
c2patool signed.jpg --crjson
```

The example places these fields under `cawg.identity.signature.certificateInfo`, including `issuer`, `subject`, and certificate validity dates. The common name is visible through `--crjson`.

This is a reporting workaround for the issue observed in May 2026, not
evidence that the missing field has since been fixed. Reading a certificate
subject also does not establish that its identity is trusted.

Sources:

- [CrJSON workaround; May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502369680118124555)
- [Certificate field structure; May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502369868396367913)
- [Workaround confirmation; May 8, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1502377614436995162)

### Does a CAWG identity certificate need to chain to the C2PA Trust List?

No. The C2PA Trust List contains roots for claim-signing certificates issued to generator
products that have passed C2PA Conformance. CAWG X.509 identity certificates
use a different model.

As of August 2026, CAWG's **interim** model used the Mozilla Root Store and
IPTC verified news publisher lists. See the
[CAWG identity 1.3 X.509 trust model](https://cawg.io/identity/1.3/#_trust_model_for_x_509_certificates),
the [Mozilla email-trust roots](https://ccadb.my.salesforce-sites.com/mozilla/IncludedRootsPEMTxt?TrustBitsInclude=Email) and the IPTC [end-entity](https://trust.iptc.org/end-entity-list.pem) and
[anchor](https://trust.iptc.org/anchor-list.pem) lists.

Do not equate C2PA product trust with CAWG identity trust, or treat the
historical interim model as an independently verified current policy.

S/MIME certificates are a common CAWG X.509 choice, including
individual-validated, sponsor-validated, and
organization-validated certificates. Having a government-issued identity
certificate does not by itself answer whether it meets CAWG's requirements;
check the CAWG X.509 trust model rather than the C2PA product Trust List.

Sources:

- [Distinct C2PA and CAWG X.509 trust models; August 20, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1540009285424119868)
- [CAWG certificate types and separate identity role; April 1, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1488868534166749375)

### Why can CAWG identity remain untrusted when the claim signer is trusted?

CAWG trust anchors need separate SDK configuration. Trust in the C2PA claim
signer does not automatically establish trust in the identity assertion.
Two possible causes are that the validator did not configure CAWG anchors, or using a CAWG certificate that does not chain to the anchors that validator uses.

Inspect the validation result's assertion URL to determine whether
`signingCredential.untrusted` refers to `cawg.identity` rather than the claim
signature. A successful signature or well-formedness check is not a
substitute for the identity trust check.

Sources:

- [Possible validator configuration causes; August 24, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1541459686690267136)
- [Separate configuration and local leaf workaround; September 7, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1546545082130370620)
- [Merged trust-list fix report; September 10, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1547575185790603264)
- [Configured-root test result; September 10, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1547641280048275550)

### Are there source-linked guides for CAWG on mobile?

For a Proofmode Android workflow using CAWG X.509 assertions and SSL.com
identity-validated certificates with captured photos and videos, see the
[user guide](https://proofmode.org/cawg_user_guide). This functionality was
available in a Proofmode Android release in October 2026.

For SDK integration, see the [CAWG mobile SDK developer guide](../cawg-mobile.mdx).
These resources are not independently reviewed instructions or a guarantee of support across all mobile SDKs, certificate authorities, or identity mechanisms.

Sources:

- [Android implementation and user guide announcement; October 16, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1560673010854264932)
- [Mobile developer guide; October 16, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1560673133684457494)

### What should I use instead of CreativeWork for creator-related data?

Use CAWG identity and metadata assertions instead of `stds.schema-org.CreativeWork` for creator-related data. See
[cawg.io](https://cawg.io). Identity trust must still be evaluated separately.

Source: [CAWG identity and metadata recommendation; August 31, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1543982994082238568)

### Can my organization's identity certificate identify all my users?

No. With the CAWG X.509 method, each user
would need a CAWG certificate issued with that user's own name or organization.
Your organization's certificate asserts your organization's identity, not
the identities of all its users. Consider **Identity Claims Aggregation**
for platforms.

Becoming a C2PA CA is a separate role: issuing signing certificates to
conforming products. To attach artist, creator, or publisher identity, use the
[CAWG identity assertion](https://cawg.io/identity/1.3/), using an X.509
certificate or Identity Claims Aggregation.

Sources:

- [Per-user X.509 identity; August 13, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537519938552733766)
- [CA versus creator identity; October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558191343988117524)