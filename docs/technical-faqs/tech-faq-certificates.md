# Certificate FAQs

These answers are based on the 45 messages in the exported CAI Certificate
Questions Discord history, covering April 4 through September 7, 2026. The
export supports six useful answered topics, selected for actionable guidance
rather than a measured frequency ranking. It includes a thread-creation
notice, but no body of that thread is available in this export.

Certificate issuance, conformance, and trust guidance reflect those
discussions and have not been independently checked against current policy,
releases, or external sources. Discord source links may require server
membership and channel access.

Selected answers also draw on the General channel history from April through
October 2026, with the same source-only, unverified status.

## How can an implementation obtain a broadly recognized signing certificate?

The April and July support answers identify C2PA generator conformance as
the route to a signing certificate intended for broad recognition by
validators. After passing conformance, a generator can obtain a conforming
product certificate from a certificate authority whose root is on the
C2PA Trust List. This is guidance about recognized trust, not a statement
that signing bytes is technically impossible without conformance.

The July description of the process starts with a completed implementation
and an expression of interest, followed by a legal agreement and intake
form. It then calls for a Generator Product Security Architecture Document
and Diagram, plus signed interoperability samples.

The reply links the [C2PA Conformance page](https://c2pa.org/conformance/)
and the
[Generator Product Security Requirements](https://github.com/c2pa-org/conformance-public/blob/main/docs/current/C2PA%20Generator%20Product%20Security%20Requirements.pdf).
These describe the route discussed in July 2026; the export does not
establish current issuance timelines, pricing, or universal acceptance by
every validator.

[Source: conformance route, April 6, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1490787978065219744)

[Source: generator and CA-root relationship, July 23, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1529960958108373043)

[Source: initial application steps, July 23, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1529961067256610816)

[Source: architecture and interoperability submissions, July 23, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1529961419376693379)

[Source: conformance reference, July 23, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1529962433861390548)

## Is a C2PA claim-signing certificate a creator identity certificate?

Not in the model described by the May support reply. Trusted C2PA
claim-signing certificates are issued for conforming hardware or software
products, rather than to establish the creator's identity.

The reply points creators to [CAWG](https://cawg.io), which complements
C2PA by attaching verified identity through a CAWG identity assertion in
the manifest. Treat the product-signing and identity roles separately;
obtaining a product certificate does not by itself establish who created,
edited, or published the content.

[Source: product certificates versus creator identity, May 14, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1504655459725082675)

## Does renewing an Interim Trust List certificate preserve its listing?

The June support answer says renewal produces a new PEM and PEM hash, so
validators do not recognize the renewed certificate as the one on the
Interim Trust List (ITL).

The follow-up also rejects treating that renewed certificate as the
certificate to add to the official C2PA Trust List after conformance.
Instead, passing conformance enables issuance of a conforming product
certificate from a CA with its root on the C2PA Trust List.

This distinguishes the particular certificate recognized by the ITL from
the CA-root-based route described for the C2PA Trust List. The April
discussion reported that the ITL had been frozen at the start of 2026;
the export does not establish a current renewal or migration exception.

[Source: renewal changes PEM recognition, June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516354125987991)

[Source: renewed certificate is not the C2PA Trust List route, June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)

[Source: conforming product certificate issuance, June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525798838767719)

[Source: historical ITL freeze, April 6, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1490788225294536734)

## Can conformance interoperability samples use a test certificate?

Yes. In the June discussion, support said interoperability samples could
be signed with a test certificate or the renewed certificate being
discussed.

Permission to use that certificate for samples is distinct from production
trust. The subsequent answer explicitly says the renewed certificate was
not the route to the official C2PA Trust List.

[Source: certificates for interoperability samples, June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516516612000186498)

[Source: production trust distinction, June 16, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1516525716341264394)

## Which certificates should the signer include in x5chain?

The September support guidance says to pass the certificate chain to the
signer in this order: **leaf first, then the intermediate CA certificate
(ICA), without the root**. The signer populates `x5chain` in the COSE
signature; the validator obtains the root from its trust list.

The trust list is therefore not a replacement for supplying the signing
chain's intermediate. This guidance does not resolve the particular
reported mismatch between a leaf and its supplied intermediate. That
case was moved to private follow-up, with no confirmed diagnosis or fix
in the export. Do not infer that including an unrelated intermediate
will establish trust.

[Source: chain order and root source, September 4, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1545416331376066621)

[Source: private follow-up without published resolution, September 7, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1546538935709208576)

## What trust-anchor configuration was recommended for a custom validator?

The July support answer recommends concatenating the C2PA Trust List PEM
and C2PA TSA Trust List PEM, then passing the combined contents as
`trust_anchors` in the tool's `trust` settings. The recommendation includes
both claim-signing and timestamp-authority trust anchors.

This is configuration guidance, not a guarantee that a particular asset
will be trusted or that an expired certificate's status is resolved merely
by adding a list. Cryptographic validity and trust remain separate checks.

The person troubleshooting the asset reported already trying this
configuration. The next event is a thread-creation notice, not a confirmed
resolution. The exported channel history cannot establish why that
particular validation continued to fail.

[Source: combined signing and timestamp trust anchors, July 9, 2026](https://discord.com/channels/983153151341371422/1276934105858314404/1524771146631872583)

## Can a conforming product rotate its signing certificate and key?

An August 12 implementer reply reports that, with Trufo, a product can
request a new certificate or rotate a certificate at any time, with APIs
available to automate the process. It links
[Trufo's certificate documentation](https://trufo.ai/documentation#certificates).

This is provider-specific experience, not a published statement of every
CA's issuance rules or all conformance requirements for key rotation. The
export does not specify a universal rotation interval or a complete
key-management procedure.

[Source: Trufo rotation and automation experience, August 12, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1537108990797025280)

## What requirements apply to a C2PA credential issuer?

The September 28 support reply distinguishes the certificate's technical
profile from the policy governing issuance by a trusted CA:

- The specification's
  [certificate profiles](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_certificate_profiles)
  define the certificate profile acceptable as a signing credential.
- The
  [C2PA Certificate Policy](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Certificate%20Policy.pdf)
  governs issuance by CAs with roots on the C2PA Trust List.

Meeting the technical profile alone is not the same as establishing
recognized trust. The answer provides requirements references, not a
reference implementation of a credential-issuer service or a list of
required service endpoints.

[Source: certificate profile versus CA issuance policy, September 28, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1554122925026840576)

## Was a free production certificate option announced?

On June 23, SSL.com announced a free tier for qualifying C2PA-conformant
generator products: an Assurance Level 1 claim-signing certificate valid
for one year and up to 10,000 trusted timestamps. The announcement links
[SSL.com's C2PA page](https://ssl.com/c2pa) for details and applications.

This was a dated provider offer, not a guarantee of current pricing,
eligibility, availability, or renewal terms. It did not remove the
conformance prerequisite and was not an offer of an individual creator
identity certificate.

[Source: provider free-tier announcement, June 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1519016971486761040)
