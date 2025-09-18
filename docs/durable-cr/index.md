---
id: index
title: Durable Content Credentials
---

[_Durable Content Credentials_](https://contentauthenticity.org/blog/durable-content-credentials) is a concept that helps content provenance to persist across content platforms by using C2PA manifest data in conjunction with:

- **Invisible watermarks**, actively inserted into the content.
- **Content fingerprints**, passively computed from the content.

Platforms that host media assets might remove C2PA manifest data, if, for example, they use software that does not yet support the standard. If a copy of the manifest data is stored in an online database, you can use a watermark or a fingerprint to find it again.
Combining both watermarks and fingerprints further improves the robustness of the provenance information.

The C2PA specification refers to watermarking and content fingerprinting as [soft bindings](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_soft_bindings), and requires that they be generated using one of the approved [Watermarking and fingerprinting algorithms](soft-bindings.mdx).
