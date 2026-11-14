---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Rust library FAQs

<TOCInline toc={toc} />

### Can I configure trust anchors using a URL?

<!--
Update for new way to configure trust using distinct types
--->

No. The Rust SDK expects trust anchors as a PEM string, not a URL or file
path. Fetch or read the PEM data in your application, then attach settings
containing the PEM to a `Context` and construct the reader from that context.

In contrast, C2PA Tool accepts URLs and paths as command-line arguments because it
retrieves the data before passing it to the SDK.

For example:

```rust
use c2pa::{Context, Reader, Settings};

let pem = reqwest::blocking::get("https://example.com/trust_anchors.pem")?
    .text()?;

let settings = Settings::new().with_toml(
    &toml::toml! {
        [trust]
        trust_anchors = pem
    }
    .to_string(),
)?;

let context = Context::new().with_settings(settings)?;
let reader = Reader::from_context(context);
```

For a local PEM file, replace the `let pem = ...` assignment above with:

```rust
let pem = std::fs::read_to_string("path/to/trust_anchors.pem")?;
```

The path is read by your application; do not set `trust.trust_anchors` to
the path itself.

Alternatively, supply an inline PEM string:

```rust
let pem = r#"-----BEGIN CERTIFICATE-----
...base64-encoded certificate data...
-----END CERTIFICATE-----"#;
```

Replace the placeholder with your complete PEM certificate data. In all
three cases, use the same settings and `Context` construction shown above:
`trust.trust_anchors` receives the PEM contents, not a URL or file path.

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

Choose labels appropriate to your implementation; this example is not a
universal conformance configuration. The hard-binding assertion is always
created.

See [Created versus gathered assertions](../manifest/writing/assertions-actions.md#created-versus-gathered-assertions)
for more information.

Source: [Created assertions config; June 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1516521499517779978)

### How do I preserve an asset's Content Credentials when editing it?

Include the original asset as a `parentOf` ingredient. If the asset is
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

### How do I avoid sidecar filename collisions?

Assets with the same base name can produce the same default sidecar
filename. For example, `file.obj` and `file.mtl` can both produce
`file.c2pa`.

Rename each sidecar immediately after creating it, retaining the asset's
original extension in the sidecar filename. For example:

```text
file.obj.c2pa
file.mtl.c2pa
```

When reading an asset with C2PA Tool, specify the corresponding sidecar with
`--external-manifest`.

Source: [Renaming sidecars, September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549894561537466399)

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

### Can I use the Rust implementation from a Java backend?

The SDK does not provide a supported Java binding. The Android bindings
are designed for Android, not as a general-purpose Java package.
Adapting them for a Java service requires additional work.

You could use the Rust implementation's
[C API](https://github.com/contentauth/c2pa-rs/tree/main/c2pa_c_ffi) to integrate through JNI.

Source: [Android scope and C API integration route, September 14, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1549054456258240674)
