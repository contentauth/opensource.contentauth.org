---
id: manifest-validation
title: Validating manifests
---

Processing an asset includes [validating the manifests](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_validation) in the associated manifest store. During validation, errors can occur in the active manifest and in ingredients.

## Validation errors in manifests

When you load an asset, all the manifests in the manifest store are validated and any [failure codes](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_failure_codes) are assigned to the `validation_status` array. Inspect the array to find the validation errors. 

:::tip
Validation returns ONLY error codes; success is not explicitly indicated. If there are no validation errors, then the manifest won't have the `validation_status` element.
:::

Manifest validation errors can occur, for example, when:

- The bits of an asset are edited after it was signed.
- A claim or assertion is missing or tampered with.
- The manifest is signed with an invalid credential.

:::caution
Don't assume that just because you didn't get an error from the function return value that there are not validation errors. You MUST check the `validation_status` array to see if there are errors or not.
:::

## Validation errors in ingredients

Ingredients are validated when they are imported into an asset and the result is stored in the ingredient's `validation_status` array.

Only errors that are not already recorded in the `validation_status` of an ingredient are reported. See [ValidationStatus](./manifest-ref#validationstatus) object in Manifest store reference.

## Error status codes

The following table describes some common validation error status codes. Refer to the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_failure_codes) for the full list.

| Validation Status Code| Description  | Type of URI |
| --------------------- | ------------ | ----------- |
| `assertion.hashedURI.mismatch` | The hash of the the referenced assertion in the manifest does not match the corresponding hash in the assertion's hashed URI in the claim. | Assertion URI  |
| `assertion.dataHash.mismatch`  | The hash of a byte range of the asset does not match the hash declared in the data hash assertion.  | Assertion URI  |
| `assertion.bmffHash.mismatch`  | The hash of a box-based asset does not match the hash declared in a [Base Media File Format BMFF](https://www.loc.gov/preservation/digital/formats/fdd/fdd000079.shtml) hash assertion. | Assertion URI  |
| `assertion.boxesHash.mismatch` | The hash of a general box-like asset format does not match the hash declared in a general boxes hash assertion. | Assertion URI  |
| `signingCredential.untrusted`  | The signing credential is not listed on the validator's trust list.| Signature Box URI |
| `signingCredential.invalid` | The signing credential is not valid for signing. | Signature Box URI |
| `signingCredential.revoked` | The signing credential has been revoked by the issuer. | Signature Box URI |
| `signingCredential.expired` | The signing credential has expired.  | Signature Box URI |

### JUMBF URIs

Validation error status codes can contain JUMBF URIs that reference assertions or signature credentials in the manifest store. If a JUMBF URI does not include a manifest ID, then it's assumed to reference the active manifest. These URIs are of the form `self#jumbf=...` as follows:

- **Assertion URI**: A URI like `self#jumbf=c2pa.assertions/<ASSERTION>` where `<ASSERTION>` is either `stds.schema-org.*` or `c2pa.*`.
- **Signature Box URI**: A URI like `self#jumbf=c2pa.signature`.

For more information, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_uri_references).

<!--
Actions and assertions:

For actions - reference the spec e.g. common actions we refer to

How to describe an EXIF assertion in JSON

CreativeWork assertion

Actions
- Examples
- Ref to spec and schema.org
- GenAI - variation of Created Action

Assertions

- CreativeWork assertion
- DNT - Special assertion
- EXIF

Verify has a URL - how do I put it in?

User-defined assertion
-->
