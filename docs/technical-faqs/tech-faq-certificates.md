---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Claim-signing certificate FAQs

<TOCInline toc={toc} />

### How can an implementation obtain a broadly recognized signing certificate?

Pass C2PA generator conformance to obtain a signing certificate intended
for broad recognition by validators. After passing conformance, a generator can obtain a conforming
product certificate from a certificate authority whose root is on the
C2PA Trust List. 

The process starts with a completed implementation and an
expression of interest, followed by a legal agreement and intake form.
Prepare a Generator Product Security Architecture Document and Diagram,
plus signed interoperability samples.

See [C2PA conformance program](../conformance/index.mdx) for more information.

### Is a C2PA claim-signing certificate the same as a creator identity certificate?

No. Trusted C2PA
claim-signing certificates are issued for conforming hardware or software
products, rather than to establish the creator's identity.

Use [CAWG](https://cawg.io), which complements C2PA by attaching verified identity through a CAWG identity assertion in the manifest. Treat the product-signing and identity roles separately;
obtaining a product certificate does not by itself establish who created, edited, or published the content.

Source: [Product certificates versus creator identity; May 14, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1504655459725082675)

### Does renewing an Interim Trust List certificate preserve its listing?

No. Renewal produces a new PEM and PEM hash, so
validators do not recognize the renewed certificate as the one on the
Interim Trust List (ITL).

Do not treat the renewed certificate as the certificate to add to the
official C2PA Trust List after conformance.
Instead, passing conformance enables issuance of a conforming product
certificate from a CA with its root on the C2PA Trust List.

This distinguishes the particular certificate recognized by the ITL from
the CA-root-based route for the C2PA Trust List. The ITL was frozen at the
start of 2026; do not assume a current renewal or migration exception exists.

Sources:

- [Renewal changes PEM recognition; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516354125987991)
- [Renewed certificate is not the C2PA Trust List route; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)
- [Conforming product certificate issuance; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525798838767719)
- [Historical ITL freeze; April 6, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1490788225294536734)

### Can conformance interoperability samples use a test certificate?

Yes. Sign interoperability samples with a test certificate. A renewed ITL
certificate can also be used for these samples.

Permission to use that certificate for samples is distinct from production
trust. A renewed ITL certificate is not the route to the official C2PA Trust List.

Sources:

- [Certificates for interoperability samples; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516612000186498)
- [Production trust distinction; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)

### Which certificates should the signer include in x5chain?

Pass the certificate chain to the signer in this order:
**leaf first, then the intermediate CA certificate
(ICA), without the root**. The signer populates `x5chain` in the COSE
signature; the validator obtains the root from its trust list.

The trust list is therefore not a replacement for supplying the signing
chain's intermediate. Ensure the intermediate belongs to the leaf's chain;
including an unrelated intermediate will not establish trust. Chain order
alone does not diagnose every leaf/intermediate mismatch.

Sources:

- [Chain order and root source; September 4, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1545416331376066621)
- [Private follow-up without published resolution; September 7, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1546538935709208576)

### What trust-anchor configuration was recommended for a custom validator?

Concatenate the C2PA Trust List PEM and C2PA TSA Trust List PEM, then pass
the combined contents as `trust_anchors` in the tool's `trust` settings. Include
both claim-signing and timestamp-authority trust anchors.

This is configuration guidance, not a guarantee that a particular asset
will be trusted or that an expired certificate's status is resolved merely
by adding a list. Cryptographic validity and trust remain separate checks.

Source: [combined signing and timestamp trust anchors, July 9, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1524771146631872583)

### Can a conforming product rotate its signing certificate and key?

With Trufo, a product can request a new certificate or rotate a certificate
at any time, with APIs available to automate the process. See
[Trufo's certificate documentation](https://trufo.ai/documentation#certificates).

This is provider-specific experience, not a published statement of every
CA's issuance rules or all conformance requirements for key rotation. The
applicable rotation interval and key-management procedure depend on your
provider and product requirements.

Source: [Trufo rotation and automation experience, August 12, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1537108990797025280)

### What requirements apply to a C2PA credential issuer?

Distinguish the certificate's technical profile from the policy governing
issuance by a trusted CA:

- The specification's
  [certificate profiles](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_certificate_profiles)
  define the certificate profile acceptable as a signing credential.
- The
  [C2PA Certificate Policy](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Certificate%20Policy.pdf)
  governs issuance by CAs with roots on the C2PA Trust List.

Meeting the technical profile alone is not the same as establishing
recognized trust. These are requirements references, not a
reference implementation of a credential-issuer service or a list of
required service endpoints.

Source: [certificate profile versus CA issuance policy, September 28, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1554122925026840576)

### Was a free production certificate option announced?

As of June 23, 2026, SSL.com offered a free tier for qualifying C2PA-conformant
generator products: an Assurance Level 1 claim-signing certificate valid
for one year and up to 10,000 trusted timestamps. See
[SSL.com's C2PA page](https://ssl.com/c2pa) for details and applications.

This was a dated provider offer, not a guarantee of current pricing,
eligibility, availability, or renewal terms. It did not remove the
conformance prerequisite and was not an offer of an individual creator
identity certificate.

Source: [provider free-tier announcement, June 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1519016971486761040)
