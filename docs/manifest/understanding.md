---
id: understanding-manifest
title: Working with manifests
---

## Understanding manifests

The concept of a _manifest_ is central to how Content Credentials work.

A collection of manifests (known as a _manifest store_) is attached to an asset. Each manifest contains information about the provenance of the asset. Creating or editing an asset using a C2PA-compliant device or tool (for example Adobe Photoshop) adds a new manifest to the manifest store.

The manifests in the manifest store are not ordered, but the most-recently added manifest is the _active manifest_. The active manifest has content bindings that can be validated with the asset&mdash;that is, it's hashed with the asset to ensure its validity.

### Location of manifest store 

A manifest store can be either:

- Directly embedded in the asset's metadata.
- In a _sidecar file_, which is a file with the same file name as the asset but with a `.c2pa` extension.

In addition, an asset can have a [external manifest store](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_external_manifests), linked from the asset's metadata, as detailed in the [C2PA specification](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_embedding_a_reference_to_an_external_manifest).  This is sometimes referred to as a _remote manifest_. 

To determine if an asset has Content Credentials, the SDK checks for the presence of a manifest store in this order:
1. In the asset metadata
1. In a sidebar file.
1. In a remote manifest.

So, for example to see if `foo.jpg` has Content Credentials, the SDK first checks if there's a manifest store in the file itself, then looks for a sidecar file (`foo.c2pa` in the same directory), and finally looks in the asset's metadata for a reference to a remote manifest store.  

:::info
Currently, only Adobe has implemented a Content Credentials cloud service to provide access to remote manifest stores, but in theory anyone could do so to provide a publicly-accessible network location for manifests.   
:::

## Binary versus JSON manifest formats

The manifest as described in the C2PA specification is a binary structure in JPEG universal metadata box format ([JUMBF](https://www.iso.org/standard/84635.html)) that can include JSON and binary data for things like encryption keys and thumbnail images.

Because the binary structure is hard to understand and program to, the SDK defines a JSON manifest structure that's a declarative language for representing and creating a manifest in binary format. The JSON manifest is a human-readable format, a more abstract translation layer that's easier to understand than the binary format. The JSON format can describe everything in the underlying binary format except for blobs representing thumbnails and other binary data that are included by a structure called a _resource reference_.

The JSON structure describes all the things in a manifest, some of which can be binaries like thumbnails, which are referenced by a file path. Then when the SDK generates the binary manifest structure, it assembles all the JSON objects, resource references, and ingredients defined, and then converts them into different assertions and other objects as required. 

## Time-stamps

The C2PA specification strongly recommends that a manifest signature contains a trusted time-stamp proving that the signature actually existed at a certain date. Specifically, it recommends using a Time-Stamp Authority (TSA) that complies with [Internet X.509 Public Key Infrastructure Time-Stamp Protocol (RFC 3161)](https://datatracker.ietf.org/doc/html/rfc3161) standard.

:::danger Warning
Manifests without time-stamps cease to be valid when the signing credential expires or is revoked.
:::

An RFC 3161 time-stamp enables you to prove the existence of a particular piece of data at a particular time. Think of it as a notary service for data. You present a piece of data (in this case, the C2PA claim data structure) and the third-party TSA verifies that it saw that data at a time that can be audited and is independently verifiable.

The time-stamp is typically defined as part of the signing information. You can set this by using C2PA Tool in the `ta_url` field or by using the SDK. The time-stamp then appears in the `SignatureInfo` JSON object when reading the manifest store.

## References

- [JUMBF](https://www.iso.org/standard/84635.html): A framework for JPEG standards to add universal metadata, supplementary images, or other elements in addition to the base image.
- [C2PA Technical Specification v2.2](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html)

