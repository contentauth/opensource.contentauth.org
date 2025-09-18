---
id: reading-ingredients
title: Reading ingredients
---

## Overview

Digital assets are often not created entirely from scratch, but instead created from one or more existing assets, for example placing an image into a layer in Photoshop. Such constituent assets are called _ingredients_.

Existing manifests may contain any of these three kinds of ingredients:
- V1, with labels starting with `c2pa.ingredient` (deprecated). See [Reading legacy manifest data](legacy.md#legacy-ingredients).
- V2, with labels starting with `c2pa.ingredient.v2` (deprecated). See [Reading legacy manifest data](legacy.md#legacy-ingredients).
- V3, with labels starting with `c2pa.ingredient.v3`, which addresses the issue of validating ingredients after redaction.

:::note
The C2PA Technical Specification describes _ingredient assertions_ but the CAI SDK treats ingredients separately as their own objects in the JSON manifest rather than as a type of assertion.
:::

## Ingredient objects

The `ingredients` array contains an element for each ingredient used to create an asset.  When an ingredient itself has Content Credentials, those manifests are included in the composed asset's manifest store to keep the provenance data intact.

The `ingredients` array contains an [ingredient object](manifest/json-ref/reader.mdx#ingredient) for each ingredient.  The `ingredient` object's `title` property  (usually is the source file name) is required for v1 and v2 ingredients, but optional for v3 ingredients.

### The label property

The `label` property is used in two ways:

- When creating an ingredient, you can assign any value you like to `label` and we will match that with the the action `ingredientIds` to find an associated action. The value you specify here does not end up in the manifest. it is optional and only used for doing action/ingredient pairing.
- When reading a manifest, the `label` will always exist and correspond to actual label assigned to the ingredient. It will be in the format you described below. Note that older v1 claims may have older forms of ingredient labels.

The `label` property for the first ingredient in a manifest is `c2pa.ingredient.v3` When there is more than one ingredient, subsequent labels have a monotonically increasing index: `c2pa.ingredient.v3__1`, `c2pa.ingredient.v3__2`, and so on.

### Other properties

Other important properties of the ingredient object include:

- `format`: MIME type of the source file (optional).
- `document_id` (optional) and `instance_id` (required) which are derived from the ingredient asset's XMP metadata.
- `thumbnail`: Object with properties that identify the thumbnail image. 
- `active_manifest`: For an ingredient with a manifest store, the label of the active manifest.  
- `relationship`: One of `parentOf`, `componentOf`, or `inputTo`. See [Relationship](#relationship) below.

An ingredient assertion must always have a `relationship` and an `instance_id`, but the API will default `relationship` to `componentOf` if not specified and will generate an `instance_id` if you don't give it one. It will also always return a label.

For example:

```json
     "ingredients": [
        ...
      {
        "title": "CAI.jpg",
        "format": "image/jpeg",
        "instance_id": "xmp:iid:315e20bf-10da-4f44-85f4-6de350bfe688",
        "thumbnail": {
          "format": "image/jpeg",
          "identifier": "xmp-iid-315e20bf-10da-4f44-85f4-6de350bfe688.jpg"
        },
        "relationship": "componentOf",
        "active_manifest": "contentauth:urn:uuid:8bb8ad50-ef2f-4f75-b709-a0e302d58019"
      }
    ]
```

### Relationship

The ingredient object's `relationship` property describes its relationship to the current asset.  This property can have one of three values, as described in the table below.

|  Value of `relationship` | Description |
|--------------------------|-------------|
| `parentOf` | The current asset is a derived asset or asset rendition of this ingredient. This relationship value is also used with update manifests.  There can be at most one parent ingredient in a manifest. |
| `componentOf` | This ingredient is one of the assets that composes the current asset. This is the default value. |
| `inputTo` | This ingredient was used as input to a computational process, such as an AI/ML model, that led to the creation or modification of this asset. |

## Validation results

The [ValidationResults](/docs/manifest/json-ref/reader#validationresults) object contains the the validation results for the active manifest and any changes to ingredients.

When ingredients are added, the SDK validates their Content Credentials (if any).  However, the validation status of an ingredient does not imply anything about the validation status of the composed asset containing the ingredient. In other words:
- A composed asset's Content Credentials may be valid, but one or more of its ingredients may have invalid Content Credentials. For example, test file [adobe-20220124-XCA.jpg](https://contentcredentials.org/verify?source=https://spec.c2pa.org/public-testfiles/image/jpeg/adobe-20220124-XCA.jpg)
- A composed asset's Content Credentials may be invalid, but one or more of its ingredients may have valid Content Credentials. For example, test file [adobe-20220124-CIE-sig-CA.jpg](https://contentcredentials.org/verify?source=https://spec.c2pa.org/public-testfiles/image/jpeg/adobe-20220124-CIE-sig-CA.jpg). 

:::note
Ingredient certificates are validated when they are added to the manifest store, NOT during validation of the composed asset. 
:::

### Example of ingredient with invalid credentials

As noted above, the test file [adobe-20220124-CIE-sig-CA.jpg](https://contentcredentials.org/verify?source=https://spec.c2pa.org/public-testfiles/image/jpeg/adobe-20220124-CIE-sig-CA.jpg) has an ingredient with invalid Content Credentials, as shown in this snippet from the manifest store: 

```json
...
{
  "active_manifest": "contentauth:urn:uuid:40f2636a-402c-4792-9da4-644a63d1f7d0",
  "manifests": {
    "contentauth:urn:uuid:40f2636a-402c-4792-9da4-644a63d1f7d0": {
    ...
    "ingredients": [
      {
        "title": "E-sig-CA.jpg",
        "format": "image/jpeg",
        "instance_id": "xmp:iid:81ca15f6-4ed0-422a-96cb-3e8014e29ac6",
        "thumbnail": {
          "format": "image/jpeg",
          "identifier": "xmp-iid-81ca15f6-4ed0-422a-96cb-3e8014e29ac6.jpg"
        },
        "relationship": "componentOf",
        "active_manifest": "contentauth:urn:uuid:04cdf4ec-f713-4e47-a8d6-7af56501ce4b",
        "validation_status": [
          {
            "code": "timeStamp.mismatch",
            "url": "Cose_Sign1",
            "explanation": "timestamp message imprint did not match"
          },
          {
            "code": "claimSignature.mismatch",
            "url": "self#jumbf=/c2pa/contentauth:urn:uuid:04cdf4ec-f713-4e47-a8d6-7af56501ce4b/c2pa.signature",
            "explanation": "claim signature is not valid"
          }
          ...
        ]
      }
    ]
```

## Examples

The [C2PA public-testfiles](https://spec.c2pa.org/public-testfiles/image/) repository has several examples of images with multiple ingredients:
- [Image with two ingredients](https://contentcredentials.org/verify?source=https://spec.c2pa.org/public-testfiles/image/jpeg/adobe-20220124-CAICA.jpg); [View JSON manifest store](https://spec.c2pa.org/public-testfiles/image/jpeg/manifests/adobe-20220124-CAICA/manifest_store.json)
- [Image with seven ingredients](https://contentcredentials.org/verify?source=https://spec.c2pa.org/public-testfiles/image/jpeg/adobe-20220124-CAIAIIICAICIICAIICICA.jpg); [View JSON manifest store](https://spec.c2pa.org/public-testfiles/image/jpeg/manifests/adobe-20220124-CAIAIIICAICIICAIICICA/manifest_store.json)
