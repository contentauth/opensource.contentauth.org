---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Rust library FAQs

<TOCInline toc={toc} />

### Can I configure trust anchors using a URL?

No. The Rust SDK expects trust anchors as a PEM string, not a URL or file
path. Fetch or read the PEM data in your application, then attach settings
containing the PEM to a `Context` and construct the reader from that context.

For example:

```rust
use c2pa::{Context, Reader, Settings};

let pem = reqwest::blocking::get("https://example.com/trust_anchors.pem")?
    .text()?;

let settings = Settings::new().with_toml(
    &toml::toml! {
        [[trust.anchors]]
        trust_kind = "manifest"
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

The path is read by your application; do not set `trust.anchors[].trust_anchors` to
the path itself.

Alternatively, supply an inline PEM string:

```rust
let pem = r#"-----BEGIN CERTIFICATE-----
...base64-encoded certificate data...
-----END CERTIFICATE-----"#;
```

Replace the placeholder with your complete PEM certificate data. In all
three cases, use the same settings and `Context` construction shown above:
`trust.anchors[].trust_anchors` receives the PEM contents, not a URL or file path.

For more ways to load and apply settings, see
[Configuring SDK settings](../sdk-repos/c2pa-rs/docs/context-settings.md#using-context).

Source: [Trust anchors: April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491236748653494503)

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
[`--external-manifest`](../sdk-repos/c2patool/docs/usage.md#using-an-external-manifest).

Source: [Renaming sidecars, September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549894561537466399)

### Can I use the Rust implementation from a Java backend?

The SDK does not provide a Java binding. The Android bindings
are designed for Android, not as a general-purpose Java package.
Adapting them for a Java service requires additional work.

You could use the Rust implementation's
[C API](https://github.com/contentauth/c2pa-rs/tree/main/c2pa_c_ffi) to integrate through JNI.

Source: [Android scope and C API integration route, September 14, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1549054456258240674)
