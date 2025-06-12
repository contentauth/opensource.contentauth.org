---
id: legacy-manifests
title: Reading legacy manifest data
---

An application should write manifest data that conforms to the recent [version 2.2](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html) C2PA technical specification, but should be abel to read and validate manifest data that conforms to earlier versions of the specification.  This ensures that your application is "backward-compatible" and can still validate older assets with claims that were written in the past.

<div class="review-comment">

`c2pa.data_mining` > `cawg.data_mining`, etc. were renamed, with xref.

`SoftwareAgent` is now a structure

`digitalSourceType` is now required on every ingredient, previously it was not.

For READING old claims (only) … v1 actions and ingredients
</div>
