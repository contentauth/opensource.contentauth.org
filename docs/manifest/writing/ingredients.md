---
id: ingredients
title: Writing ingredients
---

## Overview

Digital assets are often not created entirely from scratch, but instead created from one or more existing assets, for example placing an image into a layer in Photoshop.  Such constituent assets are called _ingredients_. 

[Old manifests](../reading/legacy.md) may contain deprecated v1 and v2 ingredients, but applications should only write v3 ingredients.

Applications should write only v3 ingredients, with label starting with `c2pa.ingredient.v3` as described in the [C2PA specification](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#ingredient_assertion).

The API will only write v3 ingredients to a v2 claim. It will write v2 ingredients to a v1 claim and will read any of the three formats.

:::note
The C2PA Technical Specification describes _ingredient assertions_ but the CAI SDK treats ingredients separately as their own objects in the JSON manifest rather than as a type of assertion.
:::

## Ingredient objects

The `ingredients` array contains an element for each ingredient used to create an asset.  When an ingredient itself has Content Credentials, those manifests are included in the composed asset's manifest store to keep the provenance data intact.

The `ingredients` array contains an [ingredient object](manifest/json-ref/manifest-def.mdx#ingredient) for each ingredient.  The only required property of the `ingredient` object is the `title` property, which usually is the source file name.

When reading an ingredient, `label` property for the first ingredient in a manifest is `c2pa.ingredient.v3` When there is more than one ingredient, subsequent labels have a monotonically increasing index: `c2pa.ingredient.v3__1`, `c2pa.ingredient.v3__2`, and so on.   you can use your own labels when creating new ingredients, but those labels are only temporary and will be replaced.

Other important properties of the ingredient object include:
- `format`: MIME type of the source file (optional).
- `document_id` (optional) and `instance_id` (required) which are derived from the ingredient asset's XMP metadata.
- `thumbnail`: Object with properties that identify the thumbnail image. 
- `active_manifest`: For an ingredient with a manifest store, the label of the active manifest.  
- `relationship`: One of `parentOf`, `componentOf`, or `inputTo`. See [Relationship](#relationship) below.

For example:

```json
"ingredients": [
  {
    "title": "turkey.jpeg",
    "format": "image/jpeg",
    "instance_id": "xmp.iid:3250038a-22ca-459b-8392-de275f8b155c",
    "relationship": "parentOf",
    "label": "c2pa.ingredient.v3"
  },
  ...
],    
```

### Relationship

The ingredient object's `relationship` property describes its relationship to the current asset.  This property can have one of three values, as described in the table below.

|  Value of `relationship` | Description |
|--------------------------|-------------|
| `parentOf` | The current asset is a derived asset or asset rendition of this ingredient. This relationship value is also used with update manifests.  There can be at most one parent ingredient in a manifest. |
| `componentOf` | This ingredient is one of the assets that composes the current asset. |
| `inputTo` | This ingredient was used as input to a computational process, such as an AI/ML model, that led to the creation or modification of this asset. |

Note that `parentOf` ingredients must have a matching `c2pa.opened` action as the first action in the manifest and `componentOf` ingredients must have an associated `c2pa.placed` action.

## Validation results

When ingredients are added, the SDK validates their Content Credentials (if any).  However, the validation status of an ingredient does not imply anything about the validation status of the composed asset containing the ingredient. In other words:

- A composed asset's Content Credentials may be valid, but one or more of its ingredients may have invalid Content Credentials. 
- A composed asset's Content Credentials may be invalid, but one or more of its ingredients may have valid Content Credentials. 

:::note
Ingredient certificates are validated when they are added to the manifest store, NOT during validation of the composed asset.
:::

## Linking actions and ingredients

To link an action and an ingredient, reuse the ingredient ID in the action's `ingredientsId` array when building the manifest.  The examples given here are for Python, but the same technique works in any language.

This example and others are in the Python library:

- [An ingredient with a `c2pa.opened` action](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L2927).
- [An ingredient with one `c2pa.opened` and one `c2pa.placed` action](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L3011).
- [Multiple ingredients with `c2pa.placed` action](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L3117).

First, get an ID for the ingredient; [for example](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L2934):

```python
parent_ingredient_id = "xmp:iid:a965983b-36fb-445a-aa80-a2d911dcc53c"
```

Use that ID when the manifest gets defined in an `ingredientsId` array; [for example](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L2958):

```json
...
"assertions": [
  {
    "label": "c2pa.actions.v2",
    "data": {
      "actions": [
        {
          "action": "c2pa.opened",
          "softwareAgent": {
              "name": "Opened asset",
          },
          "parameters": {
            "ingredientIds": [
              parent_ingredient_id
            ]
          },
          ...
```

Then the SDK links the ingredient with the action. 

This also works with an ingredient JSON with the "add ingredient" function; [for example](https://github.com/contentauth/c2pa-python/blob/main/tests/test_unit_tests.py#L2971-L2985):

```python
ingredient_json = {
    "relationship": "parentOf",
    "instance_id": parent_ingredient_id
}
# An opened ingredient is always a parent--exactly one parent ingredient is allowed.

# Read the input file (A.jpg will be signed)
with open(self.testPath2, "rb") as test_file:
    file_content = test_file.read()

builder = Builder.from_json(manifestDefinition)

# Add C.jpg as the parent "opened" ingredient
with open(self.testPath, 'rb') as f:
    builder.add_ingredient(ingredient_json, "image/jpeg", f)
    ...
```





