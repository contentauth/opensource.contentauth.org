---
id: legacy-manifests
title: Reading old manifest data
---

The latest C2PA technical specification is [version 2.2](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html). CAI recommends that applications:
- Write manifest data that conforms to this version.
- Read and validate manifest data from content credentials from applications that implemented earlier versions of the C2PA technical specification.  This ensures that your application is "backward-compatible" and can still validate assets that had claims written in the past.


<div class="review-comment">

`c2pa.data_mining` > `cawg.data_mining`, etc. were renamed, with xref.

`SoftwareAgent` is now a structure

`digitalSourceType` is now required on every ingredient, previously it was not.

For READING old claims (only) … v1 actions and ingredients
</div>
