# C2PA Conformance FAQs

These answers are based on discussions in the CAI C2PA conformance Discord
channel from April through October 2026. They have not been independently
verified against the latest requirements. Date-specific guidance reflects
those discussions, not a guarantee of current program policy. Discord source
links may require channel access.

Selected answers also draw on the General channel history from April through
October 2026, with the same source-only, unverified status.

## How do I start the conformance process?

Start with the [C2PA Conformance Program](https://c2pa.org/conformance/)
and its expression of interest form. The September 30, 2026 support reply
also linked the [program document](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/C2PA%20Conformance%20Program.pdf).

That reply explains that a generator product must pass conformance before
obtaining a signing certificate from a CA with its root on the C2PA Trust
List. Test certificates can be used while preparing for evaluation; they
are not equivalent to trusted production credentials.

[Source: certificate prerequisite, September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850060112498779)

[Source: program document, September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850126449737808)

[Source: expression of interest form, September 30, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1554850450874834964)

[Source: evaluation certificates, September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)

## How do I follow up on an application or correct its media types?

Contact the conformance administrator at **conformance@c2pa.org** for
application-specific issues. For a missing response to an expression of
interest, provide the representative email address used in the submission.
The July discussion identified a contact problem that was subsequently
resolved; it does not establish a guaranteed response time.

If a generator application incorrectly omits validation capabilities, request
a revision listing both the input media types it validates and the output
media types it generates. For example, a product could validate JPEG and PNG
ingredients while generating signed JPEG, PNG, WebP, and AVIF assets. Declare
your actual capabilities, not this example's list.

[Source: application follow-up, July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522236996553146399)

[Source: resolution, July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522288127408865310)

[Source: correcting media types, June 21, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1518382298482081872)

## Does conformance apply to the product or to each end user?

Conformance is associated with a generator or validator product, whether
software or hardware, rather than an individual user.

Creator identity is a separate concern. The support reply recommends a
separately signed CAWG identity assertion when a product needs to identify
its users. Product conformance alone does not establish each user's identity.

[Source: product conformance and identity, August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537131310424784896)

## Does a conformance listing mean the public product already uses production certificates?

Not necessarily. The May 23 General-channel reply explains that a product
can appear on the conforming products list before public launch. There can
also be a delay between listing and deploying a production certificate:
the selected CA must verify conformance and the applicant's legal identity.

The reply explains a possible listing/deployment gap; it does not establish
the status of every named product in the discussion or make a beta
certificate trusted. Evaluate the certificate actually used to sign an
asset rather than inferring its trust from the product's listing alone.

[Source: listing, launch, and certificate deployment distinction, May 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1507727660401295360)

## Why does a generator application ask about validation?

A generator that ingests assets and creates or appends manifests must invoke
validation logic against the C2PA CA and TSA Trust Lists as part of that
process. Its declared **validate** media types describe those inputs; its
**generate** media types describe the outputs for which it creates manifests.

This ingredient validation is distinct from applying as a standalone
validator product. The July reply describes a validator product as one that
validates assets without generating manifests. An August reply advises
applying separately as a validator product when also building a verification
tool.

[Source: generator validation scope, July 16, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1527310749628891176)

[Source: separate verification tool, August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537127081672974486)

## How do I choose between backend, distributed, and separate product submissions?

A distributed generator can divide asset generation, assertions, claim
generation, and signing between edge and backend subsystems while functioning
as one product. The August guidance describes mutual authentication between
the subsystems and a backend check that the caller is a valid instance of
the edge subsystem.

The May guidance says cooperating subsystems might be submitted as one
distributed product, while components that independently generate assets,
claims, and signatures would probably require separate submissions.

Do not classify a customer-hosted component solely by whether it runs on a
server. For that case, support did not give a definitive classification.
Submit an architecture summary and diagram to conformance@c2pa.org, identifying
the **Target of Evaluation**, the components included in the generator
product, and how objects submitted for signing are authenticated. The
discussion also flags dependency vulnerability scanning as a potential
challenge for customer-hosted deployments.

[Source: cooperating subsystems, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810186504671304)

[Source: independent generators, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810688638484660)

[Source: distributed authentication, August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542545382997893230)

[Source: customer-hosted architecture caveats, August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542586446815170750)

[Source: definitive assessment requires an architecture, August 28, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542842626947154031)

## Does using the latest SDK make my product conformant?

No. The May support reply generally recommends using the latest SDK, but
explicitly says that SDKs are tools for building products and must be used
in a conformant way. It does not specify a minimum SDK version.

Preparation checks highlighted in the discussion include:

- Configure created versus gathered assertions deliberately.
- Use `c2pa.created` and `c2pa.opened` appropriately. Do not describe an
  existing asset uploaded by a user as newly created by your product.
- Validate ingredients with the C2PA Trust List configured.

Interoperability test assets are provided as part of the conformance process.

[Source: test assets, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504806955154280601)

[Source: SDK recommendation and limitation, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807032341925918)

[Source: preparation checks, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

## How do I configure trust for ingredient validation?

The support guidance recommends loading both the
[C2PA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TRUST-LIST.pem)
and the
[C2PA TSA Trust List](https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TSA-TRUST-LIST.pem).
Fetch their PEM contents, concatenate them, and supply the resulting PEM
string through `trust.trust_anchors`.

For SDK integrations, pass the settings to the builder through a context.
The May 23 follow-up replaces an earlier thread-local settings example,
noting that thread-local settings had been deprecated.

The August clarification says that the C2PA Trust List alone may appear to
work for timestamp trust because the lists share roots. It still recommends
including the TSA list to pick up intermediate CA certificates. This is
trust-anchor configuration guidance, not a complete answer to every
certificate-expiration or point-in-time validation scenario.

[Source: PEM configuration, May 22, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507426136596942962)

[Source: context-based follow-up, May 23, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1507741760820871250)

[Source: TSA intermediate certificates, August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539661485234724864)

## How do I load trust lists in C2PA Tool?

Use a raw PEM URL rather than a GitHub file-view page when supplying a
trust-anchor link.

The August 6 replies explain that `c2patool init trust` loads, updates, and
stores the C2PA Trust List for reuse in subsequent commands unless overridden.
For more control, pass a settings file with `--settings`; TOML settings are
passed through to the SDK. Support also suggests supplying the concatenated
CA and TSA lists when needed to include TSA intermediate certificates.

See the source-linked
[trust settings walkthrough](https://learn.contentauthenticity.org/signing-an-edited-image).

[Source: raw PEM URL, August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534942946212708522)

[Source: initialization command, August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534943626499719369)

[Source: settings option, August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534945015598678176)

[Source: persistence and concatenated lists, August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534995351101116646)

## Which timestamp endpoints were recommended for C2PA trust?

On August 10, 2026, support identified these SSL.com endpoints as free for
general use with roots on the C2PA TSA Trust List:

- `http://ts-c2pa.ssl.com/rsa`
- `http://ts-c2pa.ssl.com/ecc`

Another participant linked
[Trufo timestamping documentation](https://trufo.ai/documentation#timestamping),
noting that its service required payment and authentication.

These are dated service recommendations, not a guarantee of current
availability, pricing, or trust-list membership.

[Source: SSL.com endpoints, August 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536414294198059132)

[Source: Trufo documentation, August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536747888305242223)

[Source: Trufo access conditions, August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536748051287248998)

## Can evaluation samples use test certificates and still report untrusted?

Yes. The September guidance permits SDK test certificates, CA-provided test
certificates, or certificates you generate yourself, but explicitly says
the evaluation signing certificates cannot be self-signed. Do not interpret
"generate your own" as permission to use a self-signed signing certificate.

The reply links
[SDK test certificates](https://github.com/contentauth/c2pa-rs/tree/main/sdk/tests/fixtures/certs)
and a [certificate creation walkthrough](https://learn.contentauthenticity.org/private-keys-and-certificates).

The October 9 clarification says `signingCredential.untrusted` is normal
before obtaining a conforming product certificate and does not itself prevent
passing conformance. This does not excuse other failures or prove that the
rest of an implementation is correct.

[Source: evaluation certificate constraints, September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)

[Source: certificate creation walkthrough, September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720168149352558)

[Source: SDK fixtures, September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720257018269826)

[Source: expected untrusted status, October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558172948022698065)

## Does adding a trusted manifest remove warnings about earlier untrusted manifests?

Do not assume that it does. The September reply explains that validators
generally show a notice when an asset contains manifests signed with
untrusted certificates. The notice may apply to individual manifests, the
manifest store, or both, depending on the validator.

When a subsequent conforming generator validates such an asset as an
ingredient, it includes the ingredient validation results. If it uses only
the C2PA Trust List, an ingredient signed with a certificate from an
untrusted private CA will produce `signingCredential.untrusted`.

This explains a trust-display consequence of a mixed pipeline. It is not a
blanket ruling that every trusted/untrusted pipeline is prohibited.

[Source: mixed-pipeline trust behavior, September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)

## How do I put the actions assertion in created assertions?

Configure `builder.created_assertion_labels` using **base assertion labels**.
For the Node bindings, support provided:

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

With only `c2pa.actions` in that setting, the support reply says that the
actions assertion and the automatically created hard binding are created
assertions; other assertions are gathered. Add other base labels as
appropriate for your implementation. This is not a universal conformance
configuration.

The August user follow-up confirmed the setting worked, but noted that the
Reader output flattened created and gathered assertions into one list.
They inspected the raw claim bytes to verify placement.

[Source: base labels and automatic hard binding, August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539665498835517531)

[Source: successful verification and Reader limitation, August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539705852968177734)

[Source: Node settings, September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696112101728396)

[Source: passing settings to the builder, September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696724411645972)

## Should ingredient assertions be created or gathered?

The July support reply recommends marking an ingredient assertion as created
in most cases because the claim generator validates it. This is
implementation-dependent guidance, not a statement that every assertion
associated with an input asset must be created.

Configure assertion placement deliberately rather than relying on the
SDK default described in the May discussion, which placed assertions other
than the hard binding in gathered assertions.

[Source: ingredient recommendation, July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)

[Source: SDK default, May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

## What does digitalSourceType describe, and when is it needed?

The July clarification says that `digitalSourceType` describes the nature
of how an **action** was performed, such as human, AI, or algorithmic activity.
It is not one asset-wide value to copy unchanged through every edit. The
reply also notes that C2PA 2.4 allows it to describe an ingredient.

The same discussion says actions affecting the asset's editorial nature need
a digital source type, whereas an unbound watermarking action does not.
An original asset should still be referenced as the ingredient associated
with `c2pa.opened`; that action does not require a digital source type.

The August clarification explicitly states that `c2pa.created` requires an
appropriate `digitalSourceType` in both C2PA 2.2 and 2.4. It links the
[specification requirement](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_mandatory_presence_of_at_least_one_actions_assertion)
and section 2.4 of the
[Additional Conformance Requirements](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/Additional%20Conformance%20Requirements%20Against%20the%20Content%20Credentials%20Specification.pdf).
Do not infer that the field is optional merely because an older validator
did not report its absence.

[Source: action and ingredient semantics, July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686021004296334)

[Source: editorial actions, July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686436689055785)

[Source: opened action and ingredient, July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686633561428018)

[Source: created action requirement, August 20, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1540014008319610961)

## How should I describe visible and invisible watermarking?

For invisible watermarking, support recommends `c2pa.watermarked.bound`
or `c2pa.watermarked.unbound`, depending on whether a `c2pa.soft-binding`
assertion is used with it.

For a visible logo, the reply recommends representing it as a `componentOf`
ingredient and recording `c2pa.placed` with a parameter referencing that
ingredient. For a text-only visible watermark, it suggests considering
`c2pa.addedText`.

These recommendations replace the question's proposed blanket mapping of
visible watermarking to `c2pa.edited` with a `composite` source type.

[Source: watermarking guidance, July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)

## Which action describes publishing an already signed asset?

For the marketplace publishing scenario discussed in May, support recommends
`c2pa.published`, together with any other actions that actually occurred.
It means the asset is released to a wider audience. The reply explicitly
says there is no `c2pa.signed` action.

Use the [official action definitions](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_actions)
to describe the operation, rather than inventing an action solely because
another signature was produced.

[Source: publication action, May 17, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1505616834148303099)

## How should I represent a user's training and mining preferences?

For the discussed seller opt-out workflow, support confirms that
`cawg.training-mining` belongs in gathered assertions. It remains
cryptographically protected there, but is not attributable to the C2PA claim
generator or signer.

The reply accepts that placement under the manifest signature. If you want
to connect the preference to a CAWG identity, reference the assertion through
the `referenced_assertions` array of `cawg.identity`.

This answers attribution and cryptographic protection; it does not claim
that the assertion enforces a user's preference on downstream systems.

An August 11 General-channel reply also cautions that companies were not
reliably respecting training-and-mining assertions in practice. Treat the
assertion as a statement of preference, not a technical block on scraping
or a guarantee against undesired AI use.

[Source: gathered preference assertion and optional identity link, June 8, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1513597018038206725)

[Source: practical enforcement limitation, August 11, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1536753197203587175)

## Can my organization's identity certificate identify all my users?

Not through the CAWG X.509 method described in the August reply. Each user
would need a CAWG certificate issued with that user's own name or organization.
Your organization's certificate asserts your organization's identity, not
the identities of all its users. Support suggests **Identity Claims
Aggregation** as an option for platforms.

The October explanation distinguishes this from becoming a C2PA CA, which
is for issuing signing certificates to conforming products. To attach
artist, creator, or publisher identity, it instead recommends the
[CAWG identity assertion](https://cawg.io/identity/1.3/), using an X.509
certificate or Identity Claims Aggregation.

[Source: per-user X.509 identity, August 13, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537519938552733766)

[Source: CA versus creator identity, October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558191343988117524)

## Why can crJSON show different specVersion values?

The August 11 explanation distinguishes two fields:

- `claim_generator_info.specVersion` in the claim describes the specification
  version declared by the generator.
- `validationResults.specVersion` describes the specification version against
  which validation was performed. It is not copied from the generator's field.

Support reproduced a claim declaring `2.4.0` while the validation results
reported `2.3.0`, and explained that the validation value was hard-coded in
the SDK implementation at that time. Check the generator value in
`claim.v2` rather than trying to change the report's validation version
through generator metadata.

That explanation resolves the field mismatch, not every conformance check.
Matching the generator field or passing a rubric alone is not presented
here as proof that a product has passed the program.

[Source: field definitions, August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536901977655742567)

[Source: reproduced version mismatch, August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536918406375276704)

## Was the Interim Trust List completely unchanged after it was frozen?

The April 27, 2026 response says necessary exceptions were made in very rare
cases and that no further changes were anticipated. This explains the
reported post-freeze updates; it is not an invitation to submit new entries
or a promise about future changes.

For ingredient validation configuration, the later support guidance points
to the C2PA Trust List and C2PA TSA Trust List.

[Source: rare exceptions, April 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1498294658600665170)

[Source: current-list configuration guidance at the time, August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539661485234724864)
