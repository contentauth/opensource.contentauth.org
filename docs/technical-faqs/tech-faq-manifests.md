---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Manifest FAQs

<TOCInline toc={toc} />

### How do I configure created versus gathered assertions?

Use `builder.created_assertion_labels` to identify the assertions attributed
to your claim generator. For example, to put the actions assertion in created
assertions:

```toml
[builder]
created_assertion_labels = ["c2pa.actions"]
```

Use only base assertion labels, without version or instance suffixes.
Use `c2pa.actions`, not `c2pa.actions.v2`, and `c2pa.ingredient`, not
`c2pa.ingredient.v3__2`. The SDK handles the version.

With only `c2pa.actions` in this setting, the actions assertion and the
hard-binding assertion are created; other assertions are gathered. Add other
base labels as appropriate for your implementation. This example is not a
universal conformance configuration.

Assertions are gathered by default, except for the hard binding, which is
always created. Configure assertion placement explicitly.

See the [Node.js example](./tech-faq-node.md#how-do-i-configure-created-versus-gathered-assertions),
the [Rust settings example](./tech-faq-rust.md#how-do-i-mark-assertions-as-created-rather-than-gathered),
and [Created versus gathered assertions](../manifest/writing/assertions-actions.md#created-versus-gathered-assertions)
for more information.

As of August 2026, the Reader output flattened created and gathered
assertions into one list. Inspect the raw claim bytes to verify placement
if your version has this limitation.

Sources:

- [Base labels and automatic hard binding; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539665498835517531)
- [Successful verification and Reader limitation; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539705852968177734)
- [Node settings; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696112101728396)
- [Passing settings to the builder; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696724411645972)

### Should ingredient assertions be created or gathered?

In most cases, mark an ingredient assertion as created because the claim
generator validates it. The appropriate placement depends on your
implementation; not every assertion associated with an input asset must be
created.

Configure assertion placement deliberately rather than relying on the
SDK default, which places assertions other than the hard binding in
gathered assertions.

Sources:

- [Ingredient recommendation; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)
- [SDK default; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

### What does digitalSourceType describe, and when is it needed?

The `digitalSourceType` property describes how an action was performed, such
as through human, AI, or algorithmic activity. It is not an asset-wide value
to copy unchanged through every edit.
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
The field is still required even if an older validator does not report its
absence.

Sources:

- [Action and ingredient semantics; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686021004296334)
- [Editorial actions; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686436689055785)
- [Opened action and ingredient; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686633561428018)
- [Created action requirement; August 20, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1540014008319610961)

### How should I describe visible and invisible watermarking?

For invisible watermarking, use `c2pa.watermarked.bound`
or `c2pa.watermarked.unbound`, depending on whether a `c2pa.soft-binding`
assertion is used with it.

Represent a visible logo as a `componentOf`
ingredient and record `c2pa.placed` with a parameter referencing that
ingredient. For a text-only visible watermark, consider
`c2pa.addedText`.

Do not map all visible watermarking to `c2pa.edited` with a `composite`
source type.

Source: [Watermarking guidance; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)

### Which action describes publishing an already signed asset?

Use `c2pa.published` when releasing an asset to a wider audience, together
with any other actions that actually occurred. There is no `c2pa.signed`
action.

Choose an action from the [official action definitions](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_actions)
that describes the operation. Do not invent an action solely to indicate
that another signature was produced.

Source: [Publication action; May 17, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1505616834148303099)

### How should I represent a user's training and mining preferences?

For a seller opt-out workflow, include `cawg.training-mining` as a gathered
assertion. The manifest signature protects the assertion, but the preference
is not attributed to the C2PA claim generator or signer.

To associate the preference with a CAWG identity, reference the assertion in
the `referenced_assertions` array of `cawg.identity`.

The assertion records a preference; it does not enforce that preference on
downstream systems. Companies might not respect training and mining
assertions, so they do not prevent scraping or guarantee protection against
unwanted AI use.

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

Matching specification-version fields or passing a rubric alone does not
establish that a product has passed the C2PA Conformance Program.

Sources:

- [Field definitions; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536901977655742567)
- [Reproduced version mismatch; August 11, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1536918406375276704)

### Can a manifest carry custom sensor or verification information?

<!--
Use reverse domain name format for custom namespace for the assertion e.g. com.pixelstream.custom-assertion-name
Custom assertions can be used for other purposes as well.
-->

Yes. Add custom assertions to a C2PA manifest to carry sensor or verification
information. A validator that supports the assertion can use that information
to identify where changes occurred.

Custom assertions require compatible implementations in both the camera or
editor and the validator. Existing validators might not support them, and
adding an assertion does not by itself establish the security guarantees of
the proposed workflow.

Source: [custom assertions and validator support, April 20, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1495831402938110155)

### Does a new manifest automatically inherit its parent's title?

No. The `parentOf` ingredient's title is not automatically assigned to the
new claim's `dc:title`. Without an explicit title in the manifest definition,
the output filename is used.

Set the desired title in the new manifest definition rather than relying on
inheritance. This sets the active manifest's title; changing an ingredient's
title is a separate operation. For the CLI workflow, see
[How can I override an ingredient's title?](./tech-faq-c2pa-tool.md#how-can-i-override-an-ingredients-title).

Sources:

- [Default title behavior; April 7, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1491244347075727431)
- [Explicit title confirmation; April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499462978687209482)

### How do I preserve an asset's Content Credentials when editing it?

Include the original asset as a `parentOf` ingredient. If the asset is
signed, its manifest and assertions are carried forward through that
ingredient. You generally do not need to copy those assertions into your
new manifest as gathered assertions.

For a typical editing workflow, use edit intent. For example, in Rust:

```rust
builder.set_intent(BuilderIntent::Edit);
```

The `Edit` intent automatically adds the `c2pa.opened` action and uses the source
as the parent if you do not specify one. Do not manually add a duplicate
`c2pa.opened` action.

Sources:

- [Parent handling; October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1559968978376593439)
- [Gathered-assertion clarification; October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1560080821287657594)

### How do I add timestamps for existing ingredient manifests?

Enable automatic timestamp assertions with these settings:

```toml
[builder.auto_timestamp_assertion]
enabled = true
fetch_scope = "all"
```

The `fetch_scope` setting indicates which manifests to fetch timestamps for.
The default is `"all"`.

Choose the builder intent according to the operation:

- Use update intent when the asset content has not changed and you only
  need to add a timestamp assertion.
- Use edit intent when you are also editing or reformatting the asset.

Add the timestamp assertion before the relevant signing certificate expires.

Sources:

- [settings, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495826791313571900)
- [intent selection, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495827650026147952)
- [certificate validity, April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491238678410821784)

### Why is no thumbnail generated for update manifests, even though thumbnails are enabled?

The SDK skips automatic thumbnail generation for update manifests,
even when thumbnail generation is enabled. The specification does not
permit update manifests to contain thumbnail
assertions.

Source: [Thumbnail auto-generation, April 19, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495464171934974002)

### Why does manifest compression barely reduce a long existing chain?

Compression applies only to the manifest being written, not to earlier
manifests in the chain. To compare compressed and uncompressed chains, enable
`core.prefer_compress_manifests` while writing each generation.

In a test of 10 manifests containing a repetitive text custom assertion,
the final manifest store was 154,638 bytes without compression and
52,583 bytes with compression enabled at each generation. Repetitive test
data is likely to compress better than real-world content, so results will
vary. Appending a compressed manifest does not compress earlier manifests.

Sources:

- [Compression scope and test recommendation, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560358414264172585)
- [Controlled comparison and data caveat, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560370962875285566)

### Does a 'Valid' validation state mean that the signer is trusted?

No. The three manifest states are
**well-formed**, **valid**, and **trusted**. Trusted manifests are also
valid, and valid manifests are also well-formed. The reverse does not follow.

A manifest signed with a test certificate can have a `Valid` state while
`validation_results.activeManifest.failure` contains
`signingCredential.untrusted`.

Do not label a manifest trusted merely because its state is `Valid`.
Inspect the trust-related validation results, and distinguish trust that
was not evaluated from a failed trust check. An issuer name alone does
not establish trust.

For details, see the
[C2PA specification](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_manifest_states).

Sources:

- [Valid-but-untrusted result; July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)
- [State hierarchy; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378030276612178)
- [Specification reference; July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378218420633610)

### Does the overall validation state describe only the active manifest?

No. `validation_state` also considers ingredient deltas, so an ingredient
failure can affect the overall state.

For the active manifest alone, inspect the success, informational, and
failure arrays in `validation_results.activeManifest`. Do not interpret
an aggregate `Invalid` result as proof that the active manifest itself
has a signature failure.

Display each manifest's state independently, distinguishing valid-but-untrusted
manifests from trusted ones. Cryptographic validity alone does not establish
signer trust.

Sources:

- [Aggregate state clarification; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509250331320778864)
- [Active-manifest results; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555410921590835)
- [Ingredient deltas; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555776585465907)
- [Per-manifest presentation guidance; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509374914510196737)

### Does adding a trusted manifest remove warnings about earlier untrusted manifests?

Not necessarily. Validators generally show a notice when an
asset contains manifests signed with
untrusted certificates. The notice may apply to individual manifests, the
manifest store, or both, depending on the validator.

When a subsequent conforming generator validates such an asset as an
ingredient, it includes the ingredient validation results. If it uses only
the C2PA Trust List, an ingredient signed with a certificate from an
untrusted private CA will produce `signingCredential.untrusted`.

A warning about an earlier untrusted manifest does not by itself mean that
the pipeline is prohibited by conformance requirements.

Source: [Mixed-pipeline trust behavior; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)
