---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';
import DiscordFaqs from '../partials/_discord-faqs.md';

# CAWG identity FAQs

<TOCInline toc={toc} />

<DiscordFaqs/>

### Does the Rust library support identity claims aggregation?

Yes. The Rust library (`c2pa-rs`) supports CAWG identity claims aggregation (ICA).
You must provide an aggregation service that returns the COSE-signed verifiable credential;
the library does not provide that service.

For the assertion structure and the aggregator's role, see
[Assertions signed using a claim aggregator](../manifest/reading/reading-cawg-id.md#assertions-signed-using-a-claim-aggregator).

See the Rust [identity module](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity)
and its [tests](https://github.com/contentauth/c2pa-rs/tree/main/sdk/src/identity/tests).

:::note
An identity claims aggregation (ICA) credential is signed by an issuer identified by a DID (for example a `did:web` or `did:jwk`). A valid signature only proves that the credential was signed by whoever controls that DID: it does **not**, on its own, establish that the issuer is trustworthy. In particular, anyone can mint a self-issued DID, so accepting it as trusted would let an attacker assert any identity.
:::

For this reason, the library treats ICA issuers as untrusted unless the DID appears in your `trusted_ica_issuers` setting.

Source: [Rust and Node ICA support and service responsibilities; August 14, 2026](https://discord.com/channels/983153151341371422/1273777445551603714/1537963403539390495)

### Does a CAWG identity certificate need to chain to the C2PA Trust List?

No. The C2PA Trust List contains roots for _claim-signing certificates_ issued to
generator products that have passed C2PA conformance. CAWG X.509 identity
certificates use a separate trust model.

As of November, 2026, [CAWG's interim X.509 trust model](https://cawg.io/identity/1.3/#_trust_model_for_x_509_certificates) used the [Mozilla Root Store](https://wiki.mozilla.org/CA) and the 
[IPTC verified news publisher list](https://iptc.org/verified-news-publishers-list/). 

S/MIME certificates are a common CAWG X.509 choice, including individual and organization certificates.

### Are there guides for using CAWG on mobile?

For an example workflow using the Android Proofmode app, CAWG X.509 assertions, and SSL.com identity certificates with captured photos and videos, see the
[ProofMode CAWG Certificate Guide](https://proofmode.org/cawg_user_guide).

For information on integrating CAWG using the CAI SDK, see the [CAWG mobile SDK developer guide](../cawg-mobile.mdx).

### What should I use instead of CreativeWork for creator-related data?

Use [CAWG identity](../manifest/reading/reading-cawg-id.md) and
[metadata assertions](../manifest/writing/assertions-actions.md#cawg-metadata-assertions) instead of
`stds.schema-org.CreativeWork` for creator-related data. See
[cawg.io](https://cawg.io). Identity trust must still be evaluated separately.

Source: [CAWG identity and metadata recommendation; August 31, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1543982994082238568)

### Can my organization's identity certificate identify all my users?

No. Your organization's certificate asserts your organization's identity, not
the identities of all its users.

There are two ways for users to assert their identity:

- Using a CAWG X.509 certificate issued with that user's own name or organization.
- Using identity claims aggregation (ICA), in which a trusted platform vendor (an identity claims aggregator)  signs CAWG identity assertions on the behalf of individual users.

For more information, see [CAWG credential types](https://cawg.io/about/identity-framework/#_cawg_credential_types).

Sources:

- [Per-user X.509 identity; August 13, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537519938552733766)
- [CA versus creator identity; October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558191343988117524)