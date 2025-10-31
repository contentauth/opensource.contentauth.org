---
id: manifest-validation
title: Validating manifests
---

Processing an asset includes [validating the manifests](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_validation) in the associated manifest store. During validation, errors can occur in the active manifest and in ingredients.

In the latest version of the SDK:

- Builder performs validation by default, so you can't create an invalid manifest.  Previously, the SDK was permissive in this regard.
- Validation is much stricter.

:::note
There is a setting to disable full validation when signing.
:::

<!-- 
Need a high-level summary of full validation, what we're looking for, etc.
--->

`Reader` has these validation methods:

- `validation_state()` returns `ValidationState` object (`validation_state` in JSON), which can be `Invalid`, `Valid` or `Trusted`.
- `validation_results()` returns `ValidationResults` (`validation_results` in JSON), which can be `success`, `informational`, and `failure` codes for the active manifest and ingredients.

:::note 
The old `ValidationStatus` and `validation_status` array in previous SDK releases are deprecated in favor of `ValidationResults` / `validation_results` and `ValidationState` / `validation_state`.
:::

## Validation errors in manifests

When you load an asset, all the manifests in the manifest store are validated and [result codes](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_failure_codes) are assigned to properties in the `validation_results` object.

Manifest validation errors can occur, for example, when:

- The bits of an asset are edited after it was signed.
- A claim or assertion is missing or tampered with.
- The manifest is signed with an invalid credential.

## Validation errors in ingredients

Ingredients are validated when they are imported into an asset and the result is stored in the [ValidationResults](./manifest/json-ref/reader#validationresults) object.

## Error status codes

The following table describes some common validation error status codes. Refer to the [C2PA Technical Specification](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_failure_codes) for the full list.

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

For more information, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_uri_references).
