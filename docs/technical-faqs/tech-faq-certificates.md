---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Claim-signing certificate FAQs

<TOCInline toc={toc} />

### How can an implementation obtain a production signing certificate?

After you [get your official notice of conformance](../conformance/conformance-guide.mdx#8-notice-of-conformance) for your generator product from C2PA, you can obtain a signing certificate from a certificate authority (CA) on the C2PA Trust List. These certificates are intended for broad recognition by validators.

See the [C2PA Conformance Program](../conformance/index.mdx) for more information.

### Is a C2PA claim-signing certificate the same as a creator identity certificate?

No. Trusted C2PA claim-signing certificates are issued for conforming hardware or software
products, rather than to establish the creator's identity.

To attach verified identity, use a [CAWG](https://cawg.io) identity assertion
in the manifest. Product signing and identity are separate roles: a product
certificate does not by itself establish who created, edited, or published
the content.

Source: [Product certificates versus creator identity; May 14, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1504655459725082675)

### Does renewing an Interim Trust List certificate preserve its listing?

No. Renewal produces a new PEM-encoded certificate and PEM hash, so
validators do not recognize the renewed certificate as the one on the
Interim Trust List (ITL).

After conformance, obtain a conforming product certificate from a CA whose root
is on the C2PA Trust List. The renewed ITL certificate is not added to that list.

The ITL recognizes individual certificates; the C2PA Trust List uses CA roots.
The ITL was frozen at the start of 2026. Check current policy before relying on
a renewal or migration exception.

Sources:

- [Renewal changes PEM recognition; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516354125987991)
- [Renewed certificate is not the C2PA Trust List route; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)
- [Conforming product certificate issuance; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525798838767719)
- [Historical ITL freeze; April 6, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1490788225294536734)

### Can conformance interoperability samples use a test certificate?

Yes. Sign interoperability samples with a test certificate. A renewed ITL
certificate can also be used for these samples.

Using a certificate for evaluation samples does not establish production trust.
A renewed ITL certificate does not qualify as a production credential on the
C2PA Trust List.

Sources:

- [Certificates for interoperability samples; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516612000186498)
- [Production trust distinction; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)

### Which certificates should the signer include in x5chain?

Pass the certificate chain to the signer with the leaf certificate first,
followed by the intermediate CA certificate (ICA). Omit the root certificate.
The signer populates `x5chain` in the COSE
signature; the validator obtains the root from its trust list.

The trust list is therefore not a replacement for supplying the signing
chain's intermediate. Ensure the intermediate belongs to the leaf's chain;
including an unrelated intermediate will not establish trust. Correct chain
order alone does not resolve every certificate mismatch.

Sources:

- [Chain order and root source; September 4, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1545416331376066621)
- [Private follow-up without published resolution; September 7, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1546538935709208576)

### What trust-anchor configuration was recommended for a custom validator?

Concatenate the PEM contents of the C2PA Trust List and C2PA TSA Trust List,
then pass the combined string through `trust.trust_anchors`. This includes
both claim-signing and timestamp authority (TSA) trust anchors.

Adding trust lists does not guarantee that an asset will be trusted or
resolve all expired-certificate issues. Evaluate cryptographic validity and
trust separately.

Source: [combined signing and timestamp trust anchors, July 9, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1524771146631872583)

### Can a conforming product rotate its signing certificate and key?

With Trufo, a product can request or rotate a certificate
at any time, with APIs available to automate the process. See
[Trufo's certificate documentation](https://trufo.ai/documentation#certificates).

This guidance is specific to Trufo. Confirm rotation intervals,
key-management procedures, and conformance requirements with your provider
and for your product.

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

Meeting the technical profile alone does not establish recognized trust.
These documents describe requirements; they do not provide a credential-issuer
reference implementation or define a complete set of service endpoints.

Source: [certificate profile versus CA issuance policy, September 28, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1554122925026840576)

### Was a free production certificate option announced?

As of June 23, 2026, SSL.com offered a free tier for qualifying C2PA-conformant
generator products: an Assurance Level 1 claim-signing certificate valid
for one year and up to 10,000 trusted timestamps. See
[SSL.com's C2PA page](https://ssl.com/c2pa) for details and applications.

Check with SSL.com for current pricing, eligibility, availability, and renewal
terms. The offer required product conformance and did not include individual
creator identity certificates.

Source: [provider free-tier announcement, June 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1519016971486761040)
