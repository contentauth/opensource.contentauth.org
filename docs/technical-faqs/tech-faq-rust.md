---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Rust library FAQs

<TOCInline toc={toc} />

### Can I configure trust anchors using a URL?

The Rust SDK expects trust anchors as a **PEM string**, not a URL or file
path. Your application must fetch or read the PEM data and pass its contents
to the SDK.

In contrast, C2PA Tool accepts URLs and paths as command-line arguments because it
retrieves the data before passing it to the SDK.

For example:

```rust
let pem = reqwest::blocking::get("https://example.com/trust_anchors.pem")?
    .text()?;

c2pa::settings::Settings::from_toml(
    &toml::toml! {
        [trust]
        trust_anchors = pem
    }
    .to_string(),
)?;
```

Source: [Trust anchors: April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491236748653494503)

### How do I mark assertions as created rather than gathered?

Use the `builder.created_assertion_labels` setting to identify assertions
attributed to your claim generator. For example:

```toml
[builder]
created_assertion_labels = [
  "c2pa.actions",
  "c2pa.thumbnail.claim",
  "c2pa.thumbnail.ingredient",
  "c2pa.ingredient"
]
```

Choose labels appropriate to your implementation. This example is not a
universal conformance configuration. The hard-binding assertion is always
a created assertion.

See [Created versus gathered assertions](../manifest/writing/assertions-actions.md#created-versus-gathered-assertions)
for more information.

Source: [Created assertions config; June 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1516521499517779978)

### How do I preserve an existing asset's assertions when editing it?

Include the original asset as a **`parentOf` ingredient**. If the asset is
signed, its manifest and assertions are carried forward through that
ingredient. You generally do not need to copy those assertions into your
new manifest as gathered assertions.

For a typical editing workflow, use:

```rust
builder.set_intent(BuilderIntent::Edit);
```

The `Edit` intent automatically adds the `c2pa.opened` action and uses the source
as the parent if you do not specify one. Do not manually add a duplicate
`c2pa.opened` action.

It is normal for a simple open-and-edit workflow to have no gathered
assertions. If you intentionally reuse metadata as a new gathered assertion,
verify that it still applies to the edited asset.

Sources:

- [Parent handling; October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1559968978376593439)
- [Gathered-assertion clarification; October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1560080821287657594)

Use the `Edit` intent when an existing asset produces
`assertion.action.malformed: first action must be created or opened`
or `assertion.action.ingredientMismatch`. Ensure manually defined
`actions` are nested inside `assertions` and the workflow includes
a referenced `parentOf` ingredient. Do not assume an "Invalid Manifest" error is a trust
problem without inspecting its validation details.

Sources:

- [action structure and edit-intent fix, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560317418574839849)
- [successful result, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560344798165074072)

### How do I add timestamps for existing ingredient manifests?

Enable automatic timestamp assertions with these settings:

```toml
[builder.auto_timestamp_assertion]
enabled = true
fetch_scope = "all"
```

Choose the builder intent according to the operation:

- Use **update intent** when the asset content has not changed and you only
  need to add a timestamp assertion.
- Use **edit intent** when you are also editing or reformatting the asset.

Add the timestamp assertion while the relevant signing
certificate is still within its validity period.

Sources:

- [settings, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495826791313571900)
- [intent selection, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495827650026147952)
- [certificate validity, April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491238678410821784)

### Why is no thumbnail generated even though thumbnails are enabled?

The SDK skips automatic thumbnail generation for **update manifests**,
even when thumbnail generation is enabled. The specification does not
permit update manifests to contain thumbnail
assertions.

Source: [Thumbnail auto-generation, April 19, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495464171934974002)

### How do I avoid sidecar filename collisions?

Assets with the same base name can produce the same default sidecar
filename. For example, `file.obj` and `file.mtl` can both produce
`file.c2pa`.

Rename each sidecar immediately after creating it to preserve the original
extension, for example:

```text
file.obj.c2pa
file.mtl.c2pa
```

When reading an asset, explicitly provide the corresponding sidecar using
`--external-manifest`.

Source: [Renaming sidecars, September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549894561537466399)

### Why does manifest compression barely reduce a long existing chain?

Compression applies to the current manifest being written, not retroactively to every manifest in an
existing chain. To compare compressed and uncompressed chains, enable
`prefer_compress_manifests` while writing each generation.

In a test of 10 manifests containing a repetitive text custom assertion,
the final manifest-store size was 154,638 bytes without compression and
52,583 bytes with compression enabled at each generation. Repetitive test
data would likely compress better
than real-world content. This is not a promised compression ratio or a way
to shrink all prior manifests by appending one compressed manifest.

Sources:

- [Compression scope and test recommendation, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560358414264172585)
- [Controlled comparison and data caveat, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560370962875285566)

### Can I use the Rust implementation from a JVM backend?

The SDK does not provide a supported Java binding.
And the Android bindings focus on Android-specific needs: Adapting them for a
JVM service would require additional work; they are not an existing,
maintained general-purpose Java package.

You could use the Rust implementation's
[C API](https://github.com/contentauth/c2pa-rs/tree/main/c2pa_c_ffi) to integrate through JNI.

Source: [Android scope and C API integration route, September 14, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1549054456258240674)
