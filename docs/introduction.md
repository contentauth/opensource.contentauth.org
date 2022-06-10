---
id: introduction
title: Introduction
---

## Overview

The Content Authenticity Initiative's open-source offerings are comprised of three products:

### JavaScript SDK

The [JavaScript SDK](js-sdk/getting-started/overview) is our open-source project for **working with C2PA data in the browser**. Use this to:

- Verify and display C2PA data on your site or web application
- Link C2PA data displayed on your site to [Verify](https://verify.contentauthenticity.org/)
- Easily add user interface elements to your web site that display C2PA data while following the [user experience recommendations](https://c2pa.org/specifications/specifications/1.0/ux/UX_Recommendations.html) set forth by the C2PA

### c2patool

[c2patool](c2patool) is an open-source utility that allows you to **work with C2PA data from the command line**. Use this to:

- Read a JSON report of C2PA manifests in supported file formats
- Add a C2PA manifest to supported file formats

### Rust SDK

The [Rust SDK](rust-sdk) is our open-source project for **adding C2PA capabilities to your desktop, mobile, or embedded application**. Use this to:

- Create and sign C2PA claims and manifests
- Embed manifests into certain file formats
- Parse and validate manifests found in certain file formats




## Concepts

Regardless of which product you use, there are certain concepts that are helpful for you to be aware of.

:::info
The C2PA Technical Specification has a [handy diagram](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_overview_2) that
illustrates the different concepts mentioned in this page.
:::

### Terms

These definitions expand on the relevant terms in the [glossary](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_glossary)
found in the [C2PA 1.0 Technical Specification](https://c2pa.org/specifications/specifications/1.0/index.html).

#### C2PA Manifest

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_c2pa_manifest):

> The set of information about the provenance of an asset based on the combination of one or more assertions (including
> content bindings), a single _claim_, and a _claim signature_. A _C2PA Manifest_ is part of a _C2PA Manifest Store_.

#### C2PA Manifest Store

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_c2pa_manifest_store):

> A collection of _C2PA Manifests_ that can either be embedded into an asset or be external to its _asset_.

#### Active Manifest

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_active_manifest):

> The last manifest in the list of _C2PA Manifests_ inside of a _C2PA Manifest Store_ which is the one with the set of _content bindings_ that are able to be validated.

#### Asset

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_asset):

> A file or stream of data containing _digital content_, asset metadata and optionally, a _C2PA Manifest_.

#### Composed asset

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_composed_asset):

> A composed asset is an _asset_ that is created by building up a collection of multiple parts or fragments of [_digital content_](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_digital_content) (referred to as ingredients) from one or more other _assets_.

For example, this can be an image (image A) where another image (image B) is imported and super-imposed on top of the starting image. In this
example, image B would be referred to as an _ingredient_.

#### Assertion

From [the specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_assertion):

> A data structure which represents a statement asserted by an _actor_ concerning the _asset_. This data is a part of the _C2PA Manifest_.

For a list of standard C2PA assertions, [click here](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_c2pa_standard_assertions).

#### Ingredient

See the definition of [composed asset](#composed-asset) above.
