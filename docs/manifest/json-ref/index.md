---
id: index
title: Manifest JSON reference
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

The [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_manifests) describes a manifest with a binary structure in JPEG universal metadata box format ([JUMBF](https://www.iso.org/standard/84635.html)) that includes JSON as well as binary data for things like encryption keys and thumbnail images. Because the binary structure is hard to understand and program to, the SDK defines a JSON manifest structure that's a declarative language for representing and creating a binary manifest.

The JSON manifest is an abstract translation layer that's easier to understand than the binary format. It can describe everything in the underlying binary format except for binary data such as thumbnails that are included by a structure called a _resource reference_. To generate a binary manifest, the SDK assembles all the JSON objects, resource references, and ingredients defined, and then converts them into different assertions and other objects as required.

These JSON references are generated from the JSON schemas for [ManifestDefinition](https://docs.rs/c2pa/latest/c2pa/struct.ManifestDefinition.html) and [Reader](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html) objects (_structs_ in Rust terminology):

- [ManifestDefinition](manifest-def.mdx): Defines a manifest and builds a manifest store.
- [Reader](reader.mdx): Reads and validates a manifest.