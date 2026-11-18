---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Claim-signing certificate FAQs

<TOCInline toc={toc} />

### How can I obtain a production signing certificate?

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
The signer populates `x5chain` in the COSE signature; the validator obtains the root from its trust list.

The trust list is therefore not a replacement for supplying the signing
chain's intermediate.

For extracting the chain from a `.pfx` file, see
[Extract certificate chain](../signing/local-signing.mdx#extract-certificate-chain).

Sources:

- [Chain order and root source; September 4, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1545416331376066621)
- [Private follow-up without published resolution; September 7, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1546538935709208576)

### Can I get a free signing certificate?

As of June 23, 2026, SSL.com offered a free tier for qualifying [C2PA-conformant
generator products](../conformance/index.mdx): an Assurance Level 1 claim-signing certificate valid for one year and up to 10,000 trusted timestamps. See [SSL.com's C2PA page](https://ssl.com/c2pa) for details and applications.

Check with SSL.com for current pricing, eligibility, availability, and renewal
terms. The offer requires product conformance and does not include individual
creator identity certificates.

:::note
Conforming generator products must use a signing certificate issued by a CA with their root certificate on the C2PA trust list.  See [C2PA Conformance Program](../conformance/index.mdx) for more information.

CAI does not endorse any particular certificate authority. Many CAs offer C2PA signing certificates. 
Evaluate them for your specific needs.  See the [**Conformance Explorer > C2PA Trust List**](https://spec.c2pa.org/conformance-explorer/) for the most up-to-date list.
:::

Source: [provider free-tier announcement, June 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1519016971486761040)

### How do I configure trust for ingredient validation?

Pass the PEM values of the [C2PA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TRUST-LIST.pem)
and the [C2PA TSA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TSA-TRUST-LIST.pem) into the `trust.anchors[]` array. For SDK integrations, pass the settings to the builder through a [context](../tasks/settings.mdx#creating-and-using-context).

For example, in Rust, assuming you have a local PEM file:

```rust
let context = Context::new().with_settings(json!({
    "trust": { "anchors": [
        { "trust_kind": "manifest", "trust_anchors": std::fs::read_to_string("c2pa-trust-list.pem")? },
        { "trust_kind": "tsa",      "trust_anchors": std::fs::read_to_string("c2pa-tsa-trust-list.pem")? }
    ]}
}))?;
```

Sources:

- [PEM configuration; May 22, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507426136596942962)
- [Context-based follow-up; May 23, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507741760820871250)
- [TSA intermediate certificates; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539661485234724864)

### Which timestamp endpoints are recommended for C2PA trust?

As of August 10, 2026, these SSL.com endpoints with roots on the [C2PA TSA Trust List](../conformance/trust-lists.mdx#c2pa-time-stamping-authority-trust-list) were free for general use:

- `https://ts-c2pa.ssl.com/rsa`
- `https://ts-c2pa.ssl.com/ecc`

Other services may require payment and authentication. Check current service terms before choosing a provider.

:::note
CAI does not endorse any particular certificate authority. Many CAs offer TSA services.  
Evaluate them for your specific needs.  See the [**Conformance Explorer > C2PA TSA Trust List**](https://spec.c2pa.org/conformance-explorer/) for the most up-to-date list.
:::

Sources:

- [SSL.com endpoints; August 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536414294198059132)
- [Trufo documentation; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536747888305242223)
- [Trufo access conditions; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536748051287248998)
