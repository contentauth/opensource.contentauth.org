---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# C2PA conformance FAQs

<TOCInline toc={toc} />

### How do I start the conformance process?

Start with the [C2PA Conformance Program](https://c2pa.org/conformance/)
and its expression of interest form. See the
[program document](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Conformance%20Program.pdf)
for details.

A generator product must pass conformance before it can 
obtain a signing certificate from an CA that has a root cert on the C2PA Trust List. 
You can use test certificates while preparing for evaluation; however, they
are not trusted production credentials.

Sources:

- [Certificate prerequisite; September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850060112498779)
- [Program document; September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850126449737808)
- [Expression of interest form; September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850450874834964)
- [Evaluation certificates; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)

### How do I follow up on an application or correct its media types?

Contact the conformance administrator at **conformance@c2pa.org** for
application-specific issues. For a missing response to an expression of
interest, provide the representative email address used in the submission.
There is no guaranteed response time.

If a generator application incorrectly omits validation capabilities, request
a revision listing both the input media types it validates and the output
media types it generates. For example, a product could validate JPEG and PNG
ingredients while generating signed JPEG, PNG, WebP, and AVIF assets. Declare
your actual capabilities, not this example's list.

Sources:

- [Application follow-up; July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522236996553146399)
- [Resolution; July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522288127408865310)
- [Correcting media types; June 21, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1518382298482081872)

### Does conformance apply to the product or to each end user?

Conformance is associated with a generator or validator product, whether
software or hardware, rather than an individual user.

Creator identity is a separate concern. Use a separately-signed CAWG identity assertion when a product needs to identify its users. Product conformance alone does not establish a user's identity.

Source: [Product conformance and identity; August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537131310424784896)

### Does a conformance listing mean the public product already uses production certificates?

Not necessarily. A product can appear on the conforming products list
before public launch. There can
also be a delay between listing and deploying a production certificate:
the selected CA must verify conformance and the applicant's legal identity.

Listing alone does not make a beta certificate trusted. Evaluate the certificate actually used to sign an asset rather than inferring its trust from the product's listing alone.

Source: [Listing, launch, and certificate deployment distinction; May 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1507727660401295360)

### Why does a generator application ask about validation?

A generator that ingests assets and creates or appends manifests must invoke
validation logic against the C2PA CA and TSA Trust Lists as part of that
process. Its declared **validate** media types describe those inputs; its
**generate** media types describe the outputs for which it creates manifests.

This ingredient validation is distinct from applying as a standalone
validator product, which validates assets without generating manifests.
Apply separately as a validator product if you are also building a
verification tool.

Sources:

- [Generator validation scope; July 16, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1527310749628891176)
- [Separate verification tool; August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537127081672974486)

### How do I choose between backend, distributed, and separate product submissions?

A distributed generator can divide asset generation, assertions, claim
generation, and signing between edge and backend subsystems while functioning
as one product. Use mutual authentication between the subsystems and a
backend check that the caller is a valid instance of
the edge subsystem.

Cooperating subsystems might be submitted as one distributed product,
while components that independently generate assets,
claims, and signatures would probably require separate submissions.

Do not classify a customer-hosted component solely by whether it runs on a
server. Classification requires an assessment of the architecture.
Submit an architecture summary and diagram to conformance@c2pa.org, identifying
the **Target of Evaluation**, the components included in the generator
product, and how objects submitted for signing are authenticated.
Dependency vulnerability scanning requirements can also be a challenge for
customer-hosted deployments.

Sources:

- [Cooperating subsystems; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810186504671304)
- [Independent generators; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810688638484660)
- [Distributed authentication; August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542545382997893230)
- [Customer-hosted architecture caveats; August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542586446815170750)
- [Definitive assessment requires an architecture; August 28, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542842626947154031)

### Does using the latest SDK make my product conformant?

No. Use the latest SDK, but remember that SDKs are tools for building
products and must be used in a conformant way.  Conformance also covers areas beyond software implementation, such as security architecture and key management practices.  You also have to submit interoperability test assets as part of the conformance process.

Some common problem areas to check include:

- Configuring created versus gathered assertions deliberately.
- Using `c2pa.created` and `c2pa.opened` appropriately. Do not describe an
  existing asset uploaded by a user as newly-created by your product.
- Validating ingredients with the C2PA Trust List configured.

Sources:

- [Test assets; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504806955154280601)
- [SDK recommendation and limitation; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807032341925918)
- [Preparation checks; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

### How do I configure trust for ingredient validation?

Load both the [C2PA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TRUST-LIST.pem)
and the [C2PA TSA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TSA-TRUST-LIST.pem).
Fetch their PEM contents, concatenate them, and supply the resulting PEM
string through `trust.trust_anchors`.

For SDK integrations, pass the settings to the builder through a context.
Do not use deprecated thread-local settings.

The C2PA Trust List alone may appear to work for timestamp trust because
the lists share roots. Include the TSA list to pick up intermediate CA
certificates. This is
trust-anchor configuration guidance, not a complete answer to every
certificate-expiration or point-in-time validation scenario.

Sources:

- [PEM configuration; May 22, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507426136596942962)
- [Context-based follow-up; May 23, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507741760820871250)
- [TSA intermediate certificates; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539661485234724864)

### Which timestamp endpoints are recommended for C2PA trust?

As of August 10, 2026, these SSL.com endpoints are free for general use
with roots on the C2PA TSA Trust List:

- `http://ts-c2pa.ssl.com/rsa`
- `http://ts-c2pa.ssl.com/ecc`

Trufo's service requires payment and authentication. See the
[Trufo timestamping documentation](https://trufo.ai/documentation#timestamping).

Sources:

- [SSL.com endpoints; August 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536414294198059132)
- [Trufo documentation; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536747888305242223)
- [Trufo access conditions; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536748051287248998)

### Can evaluation samples use test certificates and still report untrusted?

Yes. Use SDK test certificates, CA-provided test certificates, or
certificates you generate yourself, but evaluation signing certificates
cannot be self-signed. Do not interpret
"generate your own" as permission to use a self-signed signing certificate.

See the
[SDK test certificates](https://github.com/contentauth/c2pa-rs/tree/main/sdk/tests/fixtures/certs)
and a [certificate creation walkthrough](https://learn.contentauthenticity.org/private-keys-and-certificates).

Getting a `signingCredential.untrusted` error is normal
before obtaining a conforming product certificate and does not itself prevent
passing conformance.

Sources:

- [Evaluation certificate constraints; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)
- [Certificate creation walkthrough; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720168149352558)
- [SDK fixtures; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720257018269826)
- [Expected untrusted status; October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558172948022698065)

### Does adding a trusted manifest remove warnings about earlier untrusted manifests?

Do not assume that it does. Validators generally show a notice when an
asset contains manifests signed with
untrusted certificates. The notice may apply to individual manifests, the
manifest store, or both, depending on the validator.

When a subsequent conforming generator validates such an asset as an
ingredient, it includes the ingredient validation results. If it uses only
the C2PA Trust List, an ingredient signed with a certificate from an
untrusted private CA will produce `signingCredential.untrusted`.

This explains a trust-display consequence of a mixed pipeline. It is not a
blanket ruling that every trusted/untrusted pipeline is prohibited.

Source: [Mixed-pipeline trust behavior; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)

### How do I put the actions assertion in created assertions?

Configure `builder.created_assertion_labels` using **base assertion labels**.
For the Node bindings, use:

```js
const settings = {
  builder: {
    created_assertion_labels: ['c2pa.actions'],
  },
};

const builder = Builder.withJson(manifestDefinition, settings);
```

Use `c2pa.actions`, not `c2pa.actions.v2`. Likewise, do not include assertion
instance suffixes such as those in `c2pa.ingredient.v3__2`.

With only `c2pa.actions` in that setting, the actions assertion and the
automatically created hard binding are created
assertions; other assertions are gathered. Add other base labels as
appropriate for your implementation. This is not a universal conformance
configuration.

As of August 2026, the Reader output flattened created and gathered
assertions into one list. Inspect the raw claim bytes to verify placement
if your version has this limitation.

Sources:

- [Base labels and automatic hard binding; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539665498835517531)
- [Successful verification and Reader limitation; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539705852968177734)
- [Node settings; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696112101728396)
- [Passing settings to the builder; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696724411645972)

### Should ingredient assertions be created or gathered?

Mark an ingredient assertion as created in most cases because the claim
generator validates it. This is
implementation-dependent guidance, not a statement that every assertion
associated with an input asset must be created.

Configure assertion placement deliberately rather than relying on the
SDK default, which places assertions other than the hard binding in
gathered assertions.

Sources:

- [Ingredient recommendation; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)
- [SDK default; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

### What does digitalSourceType describe, and when is it needed?

The `digitalSourceType` property describes the nature
of how an **action** was performed, such as human, AI, or algorithmic activity.
It is not one asset-wide value to copy unchanged through every edit.
C2PA 2.4 also allows it to describe an ingredient.

Actions affecting the asset's editorial nature need
a digital source type, whereas an unbound watermarking action does not.
An original asset should still be referenced as the ingredient associated
with `c2pa.opened`; that action does not require a digital source type.

`c2pa.created` requires an appropriate `digitalSourceType` in both C2PA 2.2
and 2.4. See the
[specification requirement](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_mandatory_presence_of_at_least_one_actions_assertion)
and section 2.4 of the
[Additional Conformance Requirements](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/Additional%20Conformance%20Requirements%20Against%20the%20Content%20Credentials%20Specification.pdf).
Do not infer that the field is optional merely because an older validator
did not report its absence.

Sources:

- [Action and ingredient semantics; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686021004296334)
- [Editorial actions; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686436689055785)
- [Opened action and ingredient; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686633561428018)
- [Created action requirement; August 20, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1540014008319610961)

### How should I describe visible and invisible watermarking?

For invisible watermarking, use `c2pa.watermarked.bound`
or `c2pa.watermarked.unbound`, depending on whether a `c2pa.soft-binding`
assertion is used with it.

For a visible logo, represent it as a `componentOf`
ingredient and recording `c2pa.placed` with a parameter referencing that
ingredient. For a text-only visible watermark, consider
`c2pa.addedText`.

Do not map all visible watermarking to `c2pa.edited` with a `composite`
source type.

Source: [Watermarking guidance; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)

### Which action describes publishing an already signed asset?

Use `c2pa.published` when releasing an asset to a wider audience, together
with any other actions that actually occurred. There is no `c2pa.signed`
action.

Use the [official action definitions](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_actions)
to describe the operation, rather than inventing an action solely because
another signature was produced.

Source: [Publication action; May 17, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1505616834148303099)

### How should I represent a user's training and mining preferences?

For a seller opt-out workflow, put `cawg.training-mining` in gathered
assertions. It remains cryptographically protected there, but is not attributable to the C2PA claim
generator or signer.

This placement is covered by the manifest signature. If you want
to connect the preference to a CAWG identity, reference the assertion through
the `referenced_assertions` array of `cawg.identity`.

This answers attribution and cryptographic protection; it does not claim
that the assertion enforces a user's preference on downstream systems.

Companies do not necessarily respect training-and-mining assertions. Treat the
assertion as a statement of preference, not a technical block on scraping
or a guarantee against undesired AI use.

Sources:

- [Gathered preference assertion and optional identity link; June 8, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1513597018038206725)
- [Practical enforcement limitation; August 11, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1536753197203587175)

### Why can crJSON show different specVersion values?

The fields describe different specification versions:

- `claim_generator_info.specVersion` in the claim describes the specification
  version declared by the generator.
- `validationResults.specVersion` describes the specification version against
  which validation was performed. It is not copied from the generator's field.

As of August 2026, a claim could declare `2.4.0` while validation results
reported `2.3.0` because the validation value was hard-coded in the SDK
implementation. Check the generator value in
`claim.v2` rather than trying to change the report's validation version
through generator metadata.

This distinction explains the field mismatch, not every conformance check.
Matching the generator field or passing a rubric alone is not presented
here as proof that a product has passed the program.

Sources:

- [Field definitions; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536901977655742567)
- [Reproduced version mismatch; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536918406375276704)

