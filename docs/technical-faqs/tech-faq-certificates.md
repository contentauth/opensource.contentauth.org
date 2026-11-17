---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Claim-signing certificate FAQs

<TOCInline toc={toc} />

### How can an implementation obtain a production signing certificate?

After you go through the conformance process and [get the official notice of conformance](../conformance/conformance-guide.mdx#8-notice-of-conformance) for your generator product from C2PA, you can obtain a signing certificate from a certificate authority (CA) on the C2PA Trust List. These certificates are intended for broad recognition by validators.

See the [C2PA Conformance Program](../conformance/index.mdx) for more information.

### Is a C2PA claim-signing certificate the same as a creator identity certificate?

No. Trusted C2PA claim-signing certificates are issued for conforming hardware or software
products, rather than to establish the creator's identity.

To attach verified identity, use a [CAWG identity assertion](../manifest/reading/reading-cawg-id.md) in the manifest signed by an X.509 certificate or an identity claims aggregation (ICA) credential.
 Product signing and identity are separate roles.

While a C2PA manifest answers the question: "What device or app produced this file, and what happened to it?" a CAWG assertion answers the question: "Who is the person or organization behind this file, and what do they permit?"

Source: [Product certificates versus creator identity; May 14, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1504655459725082675)

### Does renewing an Interim Trust List certificate preserve its listing?

No. Renewal produces a new PEM-encoded certificate and PEM hash, so
validators do not recognize the renewed end-entity certificate as the one on the
[Interim Trust List (ITL)](../conformance/trust-lists.mdx#interim-trust-list), which was frozen at the start of 2026.

Instead of using the ITL, complete the C2PA Conformance Program to obtain a conforming product certificate from a CA whose root is on the C2PA Trust List. 


Sources:

- [Renewal changes PEM recognition; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516354125987991)
- [Renewed certificate is not the C2PA Trust List route; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)
- [Conforming product certificate issuance; June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525798838767719)
- [Historical ITL freeze; April 6, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1490788225294536734)

### Which certificates should the signer include in x5chain?

Pass the certificate chain to the signer with the leaf certificate first,
followed by the intermediate CA certificate (ICA). Omit the root certificate.
The signer populates `x5chain` in the COSE
signature; the validator obtains the root from its trust list.

The trust list is therefore not a replacement for supplying the signing
chain's intermediate. Ensure the intermediate belongs to the leaf's chain;
including an unrelated intermediate will not establish trust. Correct chain
order alone does not resolve every certificate mismatch.

For extracting the chain from a `.pfx` file, see
[Extract certificate chain](../signing/local-signing.mdx#extract-certificate-chain).

Sources:

- [Chain order and root source; September 4, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1545416331376066621)
- [Private follow-up without published resolution; September 7, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1546538935709208576)

### What trust-anchor configuration was recommended for a custom validator?

Concatenate the PEM contents of the C2PA Trust List and C2PA TSA Trust List,
then pass the combined string through `trust.anchors[].trust_anchors`. This includes
both claim-signing and timestamp authority (TSA) trust anchors.

Adding trust lists does not guarantee that an asset will be trusted or
resolve all expired-certificate issues. Evaluate cryptographic validity and
trust separately.

See [Configuring SDK settings with Context](../tasks/settings.mdx)
for applying trust and verification settings to readers and builders.

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
  define the certificate profile acceptable as a signing credential. See also
  the SDK's [certificate requirements](../signing/get-cert.md#certificate-requirements).
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

### How do I configure trust for ingredient validation?

Load both the [C2PA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TRUST-LIST.pem)
and the [C2PA TSA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TSA-TRUST-LIST.pem).
Fetch their PEM contents, concatenate them, and supply the resulting PEM
string through `trust.anchors[].trust_anchors`.

For SDK integrations, pass the settings to the builder through a [context](../tasks/settings.mdx#creating-and-using-context).
Do not use deprecated thread-local settings.

The C2PA Trust List alone might appear to work for timestamp trust because
the lists share roots. Include the TSA list to obtain intermediate CA
certificates. This configuration does not resolve every certificate-expiration
or point-in-time validation issue.

Sources:

- [PEM configuration; May 22, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507426136596942962)
- [Context-based follow-up; May 23, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507741760820871250)
- [TSA intermediate certificates; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539661485234724864)

### Which timestamp endpoints are recommended for C2PA trust?

As of August 10, 2026, these SSL.com endpoints were free for general use,
with roots on the [C2PA TSA Trust List](../conformance/trust-lists.mdx#c2pa-time-stamping-authority-trust-list):

- `http://ts-c2pa.ssl.com/rsa`
- `http://ts-c2pa.ssl.com/ecc`

At that time, Trufo's service required payment and authentication. See the
[Trufo timestamping documentation](https://trufo.ai/documentation#timestamping).
Check current service terms before choosing a provider.

Sources:

- [SSL.com endpoints; August 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536414294198059132)
- [Trufo documentation; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536747888305242223)
- [Trufo access conditions; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536748051287248998)
