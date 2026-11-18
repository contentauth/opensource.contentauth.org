---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manifest FAQs

<TOCInline toc={toc} />

### How do I configure created versus gathered assertions?

A gathered assertion is an assertion that was not created or directly vouched for by the claim signer or capture device.  Gathered assertions come from outside sources or pre-existing file metadata, in contrast to created assertions, which originate directly from the signing tool or generator.

See [Created versus gathered assertions](../manifest/writing/assertions-actions.md#created-versus-gathered-assertions)
for the attribution rules and configuration options.

For example, gathered assertions include imported IPTC or EXIF photo/video metadata, manually-entered captions, titles,  and rights information, or user-declared data like location or organization names carried over from another file or workflow.

By default, all assertions are **gathered**, except for the hard binding assertion, which is
always **created**. To identify assertions attributed to your claim generator as **created**, add the assertion labels to  `builder.created_assertion_labels` in the settings file.

Use only base assertion labels, without version or instance suffixes. Use `c2pa.actions`, not `c2pa.actions.v2`, and `c2pa.ingredient`, not `c2pa.ingredient.v3__2`. The SDK handles the version.  With only `c2pa.actions` in this setting, the actions assertion and the hard-binding assertion are **created**; other assertions are **gathered**. Add other
base labels as appropriate for your implementation.

:::note
As of August 2026, the Reader output flattened created and gathered assertions into one list. Inspect the raw claim bytes to verify placement if your version has this limitation.
:::

<Tabs groupId="programming-lang" queryString="lang">

<TabItem value="rust" label="Rust">

For example, to specify created assertions in the JSON settings file:

```json
"builder": {
  "created_assertion_labels": [
    "c2pa.actions", 
    "c2pa.thumbnail.claim",
    "c2pa.thumbnail.ingredient", 
    "c2pa.ingredient"
  ],
...
},
```

Sources:

- [Base labels and automatic hard binding; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539665498835517531)
- [Successful verification and Reader limitation; August 19, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1539705852968177734)
- [Node settings; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696112101728396)
- [Passing settings to the builder; September 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1544696724411645972)

</TabItem>

<TabItem value="node" label="Node.js">

In Node.js, you can pass the settings object to `builder` like this:

```js
const settings = {
  builder: {
    created_assertion_labels: [
      "c2pa.actions",
      "c2pa.thumbnail.claim",
      "c2pa.thumbnail.ingredient",
      "c2pa.ingredient"
    ]
  }
};
```

Sources:

- [Assertion settings; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489395644274839582)
- [Release guidance; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489396659451592754)
- [Base labels; April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489400012369694912)



</TabItem>

<TabItem value="c2patool" label="C2PA Tool">

With C2PA Tool, configure `builder.created_assertion_labels` in the settings TOML or JSON file. For example, using TOML:

```toml
[builder]

created_assertion_labels = [
  "c2pa.actions",
  "c2pa.ingredient"
]
```

Then use the `--settings` option; for example:

```sh
c2patool sample.tiff \
  --settings settings.toml \
  --manifest manifest.json \
  --output signed.tiff
```

With this command, the source asset becomes a `parentOf` ingredient and the tool automatically adds the `c2pa.opened` action.

Sources:

- [TIFF signing command and defaults; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549488757898616973)
- [Created assertion settings; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549489530598588417)

</TabItem>
  
</Tabs>


### Should ingredient assertions be created or gathered?

In most cases, an ingredient assertion is **created**, because the claim
generator validates it. The appropriate placement depends on your
implementation; not every assertion associated with an input asset must be
**created**.

By default, the SDK makes all assertions **gathered**, except for the hard binding assertion.

Sources:

- [Ingredient recommendation; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)
- [SDK default; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

### What does digitalSourceType describe, and when is it needed?

The [`digitalSourceType` property](../manifest/writing/assertions-actions.md#digital-source-type) describes how an action was performed, such
as through human, AI, or algorithmic activity. It is not an asset-wide value
to copy unchanged through every edit.
C2PA 2.4 also allows it to describe an ingredient as long as the ingredient does not contain an active manifest.

Actions affecting the asset's editorial nature need
a `digitalSourceType`, whereas an unbound watermarking action does not.
An original asset should still be referenced as the ingredient associated
with `c2pa.opened`; that action is not allowed to have a `digitalSourceType`.

`c2pa.created` requires an appropriate `digitalSourceType` in both C2PA 2.2
and 2.4. See the
[specification requirement](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_mandatory_presence_of_at_least_one_actions_assertion).
The field is still required even if an older validator does not report its
absence.

For conformance, there are additional editorial actions that require `digitalSourceType`. See section 2.4 of the
[Additional Conformance Requirements](https://github.com/c2pa-org/conformance-public/blob/main/docs/v0.2/Additional%20Conformance%20Requirements%20Against%20the%20Content%20Credentials%20Specification.pdf).

Sources:

- [Action and ingredient semantics; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686021004296334)
- [Editorial actions; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686436689055785)
- [Opened action and ingredient; July 14, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1526686633561428018)
- [Created action requirement; August 20, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1540014008319610961)

### How should I describe visible and invisible watermarking?

For invisible watermarking, use `c2pa.watermarked.bound`
or `c2pa.watermarked.unbound`, depending on whether a `c2pa.soft-binding`
assertion is used with it.

Represent a visible logo as a [`componentOf`](../manifest/writing/ingredients.md#relationship)
ingredient and record `c2pa.placed` with a parameter referencing that
ingredient. For a text-only visible watermark, consider
`c2pa.addedText`.

Source: [Watermarking guidance; July 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1524768241518641272)

### Which action describes publishing an asset?

Use `c2pa.published` when releasing an asset to a wider audience, together
with [any other actions](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_actions) that actually occurred, using the [`when` field](https://spec.c2pa.org/specifications/specifications/2.5/specs/C2PA_Specification.html#_when) to indicate the publication date, with date format according to [RFC 8949](https://www.rfc-editor.org/info/rfc8949/).

```json
"actions": [
    {
      "action": "c2pa.published",
      "when": 0("2023-02-11T09:00:00Z"),
      ...
    }
]
```

Source: [Publication action; May 17, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1505616834148303099)

### How should I represent a user's training and mining preferences?

For a seller opt-out workflow, include [`cawg.training-mining`](../manifest/writing/assertions-actions.md#cawg-training-and-data-mining-assertion) as a **gathered**
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

### Can a manifest include custom information from the claim generator?

Yes. Add [custom assertions](../manifest/writing/assertions-actions.md#custom-assertions) to a C2PA manifest to carry sensor or verification
information. Custom assertions can be used for other purposes as well. A validator that supports the assertion can use that information to identify where changes occurred.

Use reverse domain name format for custom namespace for the assertion; for example `com.pixelstream.custom-assertion-name`.

:::note
The `c2pa` namespace is reserved for official C2PA assertions and `cawg` is for CAWG assertions.  Don't use those namespaces for custom assertions.
:::

Custom assertions require compatible implementations in both the camera or
editor and the validator. Existing validators might not support them, and
adding an assertion does not by itself establish the security guarantees of
the proposed workflow.

Source: [custom assertions and validator support, April 20, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1495831402938110155)

### Does a new manifest automatically inherit its parent's title?

No. The `parentOf` ingredient's title is not automatically assigned to the
new claim's `dc:title`. Without an explicit title in the manifest definition,
the output filename is used.

If you want to carry that title forward, set the `title` in the new manifest definition, as well as the `c2pa.metadata` assertion `dc:title` field, which is the C2PA's recommended way to add a title.

For C2PA Tool, see [How can I override an ingredient's title?](./tech-faq-c2pa-tool.md#how-can-i-override-an-ingredients-title).

Sources:

- [Default title behavior; April 7, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1491244347075727431)
- [Explicit title confirmation; April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499462978687209482)

### How do I preserve an asset's Content Credentials when editing it?

Include the original asset as a `parentOf` ingredient. If the asset is
signed, its manifest and assertions are carried forward through that
ingredient. You generally do not need to copy those assertions into your
new manifest as gathered assertions.

For a typical editing workflow, use [edit intent](../tasks/intents.mdx#intent-types). For example, in Rust:

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

See the [Settings reference](../manifest/json-ref/settings-ref.mdx) for
`builder.auto_timestamp_assertion` and its available options.

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

### Why does manifest compression barely reduce the size of a long existing chain?

Compression applies only to the manifest being written, not to earlier
manifests in the chain. To compare compressed and uncompressed chains, enable
[`core.prefer_compress_manifests`](../manifest/json-ref/settings-ref.mdx) while writing each generation.

Appending a compressed manifest does not compress earlier manifests.

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

For SDK validation states and result codes, see [Validating manifests](../manifest/reading/validation.md).
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

See [Ingredient validation results](../manifest/writing/ingredients.md#validation-results)
for how an ingredient's validation status relates to the composed asset.

Display each manifest's state independently, distinguishing valid-but-untrusted
manifests from trusted ones. Cryptographic validity alone does not establish
signer trust.

Sources:

- [Aggregate state clarification; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509250331320778864)
- [Active-manifest results; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555410921590835)
- [Ingredient deltas; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555776585465907)
- [Per-manifest presentation guidance; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509374914510196737)

### Does adding a trusted manifest remove warnings about earlier untrusted manifests?

No. Validators generally show a notice when an
asset contains manifests signed with
untrusted certificates. The notice may apply to individual manifests, the
manifest store, or both, depending on the validator.

When a subsequent conforming generator validates such an asset as an
ingredient, it includes the ingredient validation results. If it uses only
the C2PA Trust List, an ingredient signed with a certificate from an
untrusted private CA will produce `signingCredential.untrusted`.

Source: [Mixed-pipeline trust behavior; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)
