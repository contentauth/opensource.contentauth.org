---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# Rust library FAQs

<TOCInline toc={toc} />


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
