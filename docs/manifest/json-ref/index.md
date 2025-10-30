---
id: index
title: JSON manifest reference
hide_table_of_contents: true
---

:::danger Warning
This is a beta release of these references. It is a work in progress and may have issues or errors. 
:::

The [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_manifests) describes a manifest with a binary structure in JPEG universal metadata box format ([JUMBF](https://www.iso.org/standard/84635.html)) that includes JSON as well as binary data for things like encryption keys and thumbnail images. Because the binary structure is hard to understand and program to, the SDK defines a JSON manifest structure that's a declarative language for representing and creating a binary manifest.

The JSON manifest is an abstract translation layer that's easier to understand than the binary format. It can describe everything in the underlying binary format except for binary data such as thumbnails that are included by a structure called a _resource reference_. To generate a binary manifest, the SDK assembles all the JSON objects, resource references, and ingredients defined, and then converts them into different assertions and other objects as required.

- [Builder](builder-ref.mdx) - Use to add a signed manifest to an asset.
- [Reader](reader-ref.mdx) -  Use to read and validate a manifest store.
- [ManifestDefinition](manifest-def.mdx) - Use to define a manifest (a collection of ingredients and assertions) that can be added to a manifest store, signed, and embedded into a file.
- [Settings](settings-ref.mdx) - Use to define all aspects of code for working with Content Credentials.




