---
id: assertions-actions
title: Writing assertions and actions
---

## Overview

Assertions provide information about when, where, and how an asset was created or transformed.

The JSON manifest contains an `assertions` array, whose elements are [AssertionDefinition](../json-ref/manifest-def.mdx#assertiondefinition) objects. An AssertionDefinition object has two required properties: `label`, a string, and `data`, which can contain arbitrary information. When [reading an assertion](../json-ref/reader-ref.mdx#manifestassertion), there are two optional properties, `kind` and `instance`.

The standard form of an assertion in a JSON manifest is:

```json
"assertions": [
  ...
  {
    "label": "Label string",
    "data": { 
      // Arbitrary data in JSON-LD format .. 
    },
    "kind": "Json" // Optional: one of “Cbor”,  “Json”, “Binary”, or “Uri”
    "instance" : 0 // Optional and rarely used
  },
  ...
]
```

:::important
Every manifest has to start with either an opened or created action, which has to be the first action in the manifest. Each of these actions need to have an associated ingredient.
:::

### Changes from earlier releases

Changes include: 
- Old training and data mining assertions `c2pa.data_mining`, `c2pa.ai_training`,  `c2pa.ai_generative_training`, and `c2pa.ai_inference` have been replaced by [CAWG training and data mining assertions](../writing/assertions-actions.md#cawg-training-and-data-mining-assertion)
- `SoftwareAgent` is a [ClaimGeneratorInfo](../json-ref/manifest-def.mdx#claimgeneratorinfo) structure instead of a string. 
- Ingredients are now V3 ingredients

## C2PA standard assertions

The C2PA Technical Specification defines a [set of standard assertions](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_standard_c2pa_assertion_summary) and their corresponding labels.  In addition, you can define [custom assertions](#custom-assertions) for your specific application.

The following table summarizes some of the most important standard assertions.

| Assertion | Label | Description |
|-----------|-------|-------------|
| [Content bindings](#content-bindings) | `c2pa.hash.*`, `c2pa.soft-binding`, etc. | Uniquely identify portions of an asset and bind the assertion to it, for example using cryptographic hashes. |
| [Actions](#actions) (v2) |  `c2pa.actions.v2` | Creation, edits, and other actions on an asset, such as cropping, color or contrast adjustment, and so on. |

:::note
The CAI SDK handles assertions for thumbnails, content bindings, and ingredients, so normally you don't need to think about them.
:::

### Content bindings

Content bindings are standard assertions such as `c2pa.hash.boxes` and `c2pa.hash.data` that uniquely identify portions of an asset.  For more information on content bindings, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_binding_to_content).

:::note
The CAI SDK writes content bindings assertions, so normally you don't need to write them, just read them.
:::

For example, the `c2pa.hash.data` assertion shown in the [detailed manifest example](../examples.mdx#detailed-manifest) specifies an exclusion hash:

```json
"assertions": [
  ...
  "c2pa.hash.data": {
    "alg": "sha256",
    "exclusions": [
      {
        "length": 51179,
        "start": 20
      }
    ],
    "hash": "DcGR4k9M6aLXXCeDii4tSdX45rrIM5HSr1Wy/czQ6ro=",
    "name": "jumbf manifest",
    "pad": "<omitted>"
  },
  ...
]
```

<!-- Commented out for now, add subsequently

Timestamp assertion

See <https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#timestamp_assertion>.

Update assertions

-->

## Created versus gathered assertions

In v2 claims, assertions are split into *created assertions* and *gathered assertions* and you can configure the assertion type by using SDK settings. By default, the hard binding is a created assertion and everything else defaults to a gathered assertion.  Configure assertions that are attributed to the signer as created assertions, such as actions performed, ingredients included, or thumbnails included.  
Leave assertions that are based on human input or part of an external workflow as gathered assertions.

:::tip
For a video explanation with an example of how to configure created/gathered assertions using a settings file, see [Content Credentials Foundations - Configuring C2PA Tool Settings](https://learn.contentauthenticity.org/configuring-c2pa-tool-settings) (around the 6 min. mark). 
:::

The difference between a **created assertion** and a **gathered assertion** comes down to **who originates the information and how it gets into the manifest**.

At a high level:

- **Created assertion** means “I created this or made this modification.”
- **Gathered assertion** means “This was already present; I preserved it.”

### Created assertion

A *created assertion* is:

* **Authored directly by the claim generator**.
* Explicitly written into the manifest by the actor.
* Intentionally asserted as part of the Content Credentials.

For example:

* “This image was generated using Adobe Firefly”
* “This video was edited in Premiere Pro”
* Custom metadata like author name, title, or usage rights
* Actions like `c2pa.actions.edit`, `c2pa.actions.crop`, and so on.

:::note
All `created_assertions` are attributed to the signer as the trust model is rooted in the trust of the signer.
:::

This will always include the hard binding e.g. `c2pa.hash.data`.  It is common to see assertions like `c2pa.thumbnail.claim`, `c2pa.ingredient.v3`, and `c2pa.actions.v2` configured as created assertions, but there could be more.

From the [C2PA specification](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_fields):

> The `created_assertions` field shall be present and it shall contain one or more URI references to assertions being made by this claim. In a standard manifest, it shall contain, at minimum, a reference to an assertion that represents a hard binding.

### Gathered assertion

A *gathered assertion* is:

* **Collected from existing metadata or embedded information**.
* Not newly authored by the claim generator.
* Carried forward into the manifest for transparency.

For example:

* Camera make/model pulled from EXIF metadata
* Original capture timestamp in XMP metadata
* GPS data extracted from file metadata

From the [C2PA specification](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_fields):

> When present, the `gathered_assertions` field shall contain one or more URI references to assertions that have been provided to the claim generator by other components in the workflow.

:::note
By putting an assertion into this list, the claim generator is declaring that the assertion is part of the claim, but it was not sourced from the claim generator and is not attributed to the signer. For example, assertions containing information entered by a human actor would be listed in `gathered_assertions`.
It is common to see assertions like `cawg.training-mining` and `cawg.metadata` configured as gathered assertions.
:::

### Configuration in SDK settings

Configure the settings file with the created assertions like this:

```toml
[builder]
created_assertion_labels = [
  "c2pa.actions", 
  "c2pa.thumbnail.claim",
  "c2pa.thumbnail.ingredient", 
  "c2pa.ingredient"
]
```

Or in JSON:

```json
"builder": {
  "created_assertion_labels": [
    "c2pa.actions", 
    "c2pa.thumbnail.claim",
    "c2pa.thumbnail.ingredient", 
    "c2pa.ingredient"
  ],
...
},
```

### Configuring in manifest

You can configure created assertions in a manifest definition with the `created` property of an [assertion](https://opensource.contentauthenticity.org/docs/manifest/json-ref/builder-schema#assertiondefinition) that is `true` if the assertion is created or `false` (the default) if it's derived from the asset or an ingredient.

For example:

```json
"assertions": [
  {
    "created": true 
    "label": "c2pa.actions.v2",
    "data": {
      "actions": [
        {
          "action": "c2pa.resized"
        }
      ]
    },
  }
]
```

For a gathered assertion:

```json
{
  "label": "c2pa.capture.metadata",
  "created": false,
  "data": {
    "captureTime": "2026-02-10T14:22:31Z",
    "device": {
      "manufacturer": "Canon",
      "model": "EOS R5"
    }
  }
}
```

## Actions

An action is an assertion that provides information about creation, edits, and other things that have occurred to an asset. In the manifest, an `actions` assertion is an array of [AssertionDefinition](../json-ref/manifest-def.mdx#assertiondefinition) objects.   

:::important
Every manifest has to start with either an `c2pa.opened` or `c2pa.created` action, which has to be the first action in the manifest. Each of these actions need to have an associated ingredient.
:::

For example:

```json
...
"assertions": [
  {
    "label": "c2pa.actions.v2",
    "data": {
      "actions": [
        {
          "action": "c2pa.created",
          "digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
          "softwareAgent": "Adobe Firefly"
        }
      ]
    }
  }
],
...
```

Each object in the `actions` array has the following standard properties.

| Property | Required? | Description | Example |
|----------|-----------| ------------|---------|
| `action` | Yes | The action name.  See [Action names](#action-names). | `c2pa.created` |
| `digitalSourceType` | No | A URL identifying a [IPTC term](https://cv.iptc.org/newscodes/digitalsourcetype/). See [Digital source type](#digital-source-type). | `http://cv.iptc.org/newscodes/`<br/> `digitalsourcetype/digitalCapture` |
| `softwareAgent` | No | The software or hardware used to perform the action.   | `"Adobe Firefly"` |
| `parameters` | No | Additional information describing the action; see [Parameters](#parameters) | Reference to ingredients in the `ingredientIds` array. |
| `parameters` | No | Additional information describing the action; see [Parameters](#parameters) | Reference to ingredients in the `ingredientIds` array. |

### V2 actions

The [C2PA Technical Specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_actions) describes expanded v2 actions.  V1 actions have a label of `c2pa.actions` v2 actions have a label of `c2pa.actions.v2`. Actions are modelled after XMP ResourceEvents, but with a number of C2PA-specific adjustments.

V1 actions are fully specified in the `actions` array. However, a v2 action may either be fully specified in an element of the `actions` array or it may be derived from an element in the `templates` array with the same action name.

<div style={{display: 'none'}}>
The CAI APIs can read all v2 actions and write **most** v2 actions.  
We should document v2 actions that can it NOT write.
</div>

### Action names

The value of the `action` property must be either one of the pre-defined [standard C2PA action strings](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_actions) of the form `c2pa.*` or a custom action name. The set of standard C2PA actions includes fundamental ones as `c2pa.created` for when an asset is first created, and others (`c2pa.cropped`, `c2pa.resized`, and so on) for when an asset's content is modified in some way.  

For the complete list of standard actions, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_actions).

### Digital source type

Use the `digitalSourceType` property to specify how an asset was created or modified, for example "digital capture", "digitized from negative," or "trained algorithmic media." 

The value of `digitalSourceType` is one of the URLs specified by the International Press Telecommunications Council (IPTC) [NewsCodes Digital Source Type scheme](https://cv.iptc.org/newscodes/digitalsourcetype/) of the form `http://cv.iptc.org/newscodes/digitalsourcetype/<CODE>`, where `<CODE>` is one of the codes shown in the following table.

| Code | Description |
|---|---|
| algorithmicallyEnhanced | Minor augmentation or correction by algorithm. |
| algorithmicMedia | Media created purely by an algorithm not based on any sampled training data, e.g. an image created by software using a mathematical formula. |
| composite | Mix or composite of several elements, any of which may or may not be generative AI. |
| compositeCapture | Mix or composite of several elements that are all captures of real life. |
| compositeSynthetic | Mix or composite of several elements, at least one of which is synthetic. |
| compositeWithTrainedAlgorithmicMedia | The compositing of trained algorithmic media with some other media, such as with inpainting or outpainting operations. |
| dataDrivenMedia | Digital media representation of data via human programming or creativity. |
| digitalCreation | Media created by a human using non-generative tools. Use instead of retired digitalArt code. |
| digitalCapture | The digital media is captured from a real-life source using a digital camera or digital recording device. |
| humanEdits | Augmentation, correction or enhancement by one or more humans using non-generative tools.  Use instead of retired minorHumanEdits code. | 
| negativeFilm | The digital image was digitized from a negative on film or any other transparent medium. |
| positiveFilm | The digital image was digitized from a positive on a transparency or any other transparent medium. |
| print | The digital image was digitized from an image printed on a non-transparent medium. |
| screenCapture | A capture of the contents of the screen of a computer or mobile device. |
| trainedAlgorithmicMedia | Digital media created algorithmically using a model derived from sampled content. |
| virtualRecording | Live recording of virtual event based on synthetic and optionally captured elements. |

:::note
This table is provided for convenience.  For the authoritative list, see the [IPTC NewsCodes Digital Source Type scheme (controlled vocabulary)](https://cv.iptc.org/newscodes/digitalsourcetype/).
:::

### Generative AI action

To specify that an asset was created using generative AI, use the `c2pa.created` action with `digitalSourceType` that's one of:
- `trainedAlgorithmicMedia` for an asset created by generative AI tools.
- `compositeWithTrainedAlgorithmicMedia` for an asset that contains one or more elements that were created by generative AI tools.

For other possible values of `digitalSourceType`, see [Digital source type](#digital-source-type).

```json
"assertions": [
...
  {
    "label": "c2pa.actions.v2",
    "data": {
      "actions": [
        {
          "action": "c2pa.created",
          "digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
          "softwareAgent": "<TOOL_NAME>"
        }
      ]
    }
  }
...
]
```

Where `<TOOL_NAME>` is the name of the generative AI tool or service.

### Parameters 

The `parameters` property can contain any data that provide more details on the action, for example:

```json
"actions": [
  {
    "action": "c2pa.color_adjustments",
    "parameters": {
      "com.adobe.acr": "Contrast2012",
      "com.adobe.acr.value": "26"
    }
  },
  ...
]
```

When creating an actions assertion that has an associated ingredient, the `parameters` object must include a `ingredientIds` property with an array of one or more [`instance_id` values](#the-instance_id-property) from ingredients. This is how you associate an action with one or more ingredients.
When creating an actions assertion that has an associated ingredient, the `parameters` object must include a `ingredientIds` property with an array of one or more [`instance_id` values](#the-instance_id-property) from ingredients. This is how you associate an action with one or more ingredients.

:::info
The [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_parameters) requires that a `c2pa.transcoded`, `c2pa.repackaged`, `c2pa.opened`, or a `c2pa.placed` action have one or more associated ingredients, so it is very important to add the `ingredientIds` parameter with a matching ingredient.
The [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_parameters) requires that a `c2pa.transcoded`, `c2pa.repackaged`, `c2pa.opened`, or a `c2pa.placed` action have one or more associated ingredients, so it is very important to add the `ingredientIds` parameter with a matching ingredient.
:::

For example:

```json
"actions": [
  {
    "action": "c2pa.opened",
    "parameters": {
      "ingredientIds": [
      "ingredientIds": [
        "xmp.iid:813ee422-9736-4cdc-9be6-4e35ed8e41cb"
      ]
    }
  },
  ...
```

:::note
The old `ingredientId` field is deprecated.
:::

For more information on action parameters, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_parameters).

#### The instance_id property

When defining/writing a manifest, the `instance_id` property identifies an ingredient used in an action.

Any `c2pa.opened` or `c2pa.placed` action must have an associated ingredient identified by the `ingredientIds` parameters field of the action with an array of ingredient `instance_id` values.

```json
"ingredients": [
  {
    ...
    "instance_id": "<String-instance-ID-of-ingredient>",
    "relationship": "parentOf",
    "label": "c2pa.ingredient.v3"
  },
  ...
],
"actions": [
  {
    "action": "c2pa.*",
    "parameters": {
      "ingredientIds": [
      "ingredientIds": [
        "<String-instance-ID-of-ingredient>"
      ],
    }
  },
  ...
]
```

For example, the following action identifies that the `c2pa.opened` action was performed on the ingredient with ID `xmp.iid:3250038a-22ca-459b-8392-de275f8b155c`:

```json
"ingredients": [
  {
    "title": "crater-lake.jpeg",
    "format": "image/jpeg",
    "instance_id": "xmp.iid:7f136ee1-6e84-4d80-9de3-e1180ef2b690",
    "relationship": "parentOf",
    "label": "c2pa.ingredient.v3"
  }
],
"assertions": [
  {
    "label": "c2pa.actions.v2",
    "data": {
      "actions": [
      {
        "action": "c2pa.opened",
        "parameters": {
          "org.cai.ingredientIds": [
            "xmp.iid:7f136ee1-6e84-4d80-9de3-e1180ef2b690"
          ],
          "ingredients": [
            {
              "url": "self#jumbf=c2pa.assertions/c2pa.ingredient.v3",
              "hash": "yb/F7GBepYRyaFM16gzj6t84CKDTnBxhnLqYjnB0iX0="
            }
          ]
        }
      },
      ...
      ]
    }
  }
]
```

## CAWG metadata assertions

Starting with version 2.2, the C2PA specification provides for a category of [metadata assertions](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html#_metadata) with a standardized serialization that replace the old Exif, IPTC, and Creative Work assertions in prior versions of the specification.

Use _CAWG metadata assertions_ to include metadata from metadata standards such as XMP, IPTC, and Exif in a manifest.  For more information, see the [CAWG Metadatda Assertion](https://cawg.io/metadata/1.1/#_assertion_definition) technical specification.

Metadata assertions must include one or more `@context` properties in the `data` object, as explained in the [JSON-LD](https://www.w3.org/TR/json-ld/#the-context) specification.  Follow the examples shown in each section.

| Assertion | Label | Description |
|-----------|-------|-------------|
| [Exif information](#exif-assertion) | `stds.exif` | Camera information such as maker, lens stored in Exchangeable image file format (Exif). |
| [IPTC photo and video metadata](#iptc-metadata-assertion) | `stds.iptc` | Properties from the IPTC Photo and Video Metadata Standards, describing for example ownership, rights, and other metadata about a image or video asset. |
| [CAWG training and data mining](#cawg-training-and-data-mining-assertion) | `cawg.training-mining` | Whether the creator/owner of an asset grants permission to use it for data mining or AI/ML training.  NOTE: Previously, this assertion's label was `c2pa.training-mining`. |

### Exif assertion

Exchangeable image file (Exif) format is a standard for storing technical metadata in image files of JPEG, TIFF, PNG, and other formats. Most digital cameras (including smartphones), scanners and other digital capture devices use Exif to store information such as device make and model, shutter speed, ISO number, date and time of capture, location, and so on.  For more information on Exif, see the [Exif specification](https://www.cipa.jp/std/documents/download_e.html?DC-008-Translation-2019-E).

Use an Exif assertion to add Exif information to the asset in a way that can be validated cryptographically.  An Exif assertion has the label `stds.exif`.

Here is a simple example:

```json
"assertions": [
  ...
  {
    "label": "stds.exif",
    "data": {
      "@context" : {
        "exif": "http://ns.adobe.com/exif/1.0/"
      },
      "exif:GPSVersionID": "2.2.0.0",
      "exif:GPSLatitude": "39,21.102N",
      "exif:GPSLongitude": "74,26.5737W",
      "exif:GPSAltitudeRef": 0,
      "exif:GPSAltitude": "100963/29890",
      "exif:GPSTimeStamp": "2019-09-22T18:22:57Z"
    }
  }
  ...
]
```

### IPTC metadata assertion

An International Press Telecommunications Council (IPTC) metadata assertion represents properties from the [IPTC Photo Metadata Standard](https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata) and [Video Metadata Standard](https://www.iptc.org/standards/video-metadata-hub/recommendation/) that describe ownership, rights, and descriptive metadata about an asset. 

An IPTC assertion has the label `stds.iptc` and is stored in JSON-LD format using the XMP field names and structures specified in the IPTC standards.

Earlier versions of the C2PA specification defined the `stds.iptc.photo-metadata` label for IPTC photo metadata; starting with version 1.3, the C2PA specification defines the `stds.iptc` assertion that includes video metadata as well. 

:::note
Do not use the IPTC `plus:DataMining` property to indicate whether permission is granted to use an asset in data mining or AI/ML training. Instead use the [CAWG training and data mining assertion](#cawg-training-and-data-mining-assertion).
:::

See also: [IPTC Photo Metadata User Guide](https://www.iptc.org/std/photometadata/documentation/userguide/).

For example:

```json
...
"assertions": [
  ...
  {
    "label": "stds.iptc",
    "data": {
      "@context" : {
        "Iptc4xmpCore": "http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/",
        "Iptc4xmpExt": "http://iptc.org/std/Iptc4xmpExt/2008-02-29/",
        "dc" : "http://purl.org/dc/elements/1.1/",
        "photoshop" : "http://ns.adobe.com/photoshop/1.0/",
        "plus" : "http://ns.useplus.org/ldf/xmp/1.0/",
        "xmp" : "http://ns.adobe.com/xap/1.0/",
        "xmpDM" : "http://ns.adobe.com/xmp/1.0/DynamicMedia/",
        "xmpRights" : "http://ns.adobe.com/xap/1.0/rights/"
      },
      "photoshop:DateCreated": "Aug 31, 2022",
      "dc:creator": [ "Julie Smith" ],
      "Iptc4xmpExt:DigitalSourceType": "https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture",
      "dc:rights": "Copyright (C) 2022 Example Photo Agency. All Rights Reserved.",
      "photoshop:Credit": "Julie Smith/Example Photo Agency via Example Distributor",
      "plus:licensor": [
        {
          "plus:LicensorName": "Example Photo Agency",
          "plus:LicensorURL": "http://examplephotoagency.com/images/"
        }
      ],
      "xmpRights:WebStatement": "http://examplephotoagency.com/terms.html",
      "xmpRights:UsageTerms": [
        "Not for online publication. Germany OUT"
      ],
      "Iptc4xmpExt:LocationCreated": {
        "Iptc4xmpExt:City": "San Francisco"
      },
      "Iptc4xmpExt:PersonInImage": [
        "Erika Fictional"
      ],
      "Iptc4xmpCore:AltTextAccessibility": "Photo of Erika Fictional standing in front of the Golden Gate Bridge at sunset."
    }
  },
  ...
]
```

## CAWG training and data mining assertion

Assertions with the `cawg.training-mining` label provide information about whether an asset with C2PA metadata may be used as part of a data mining or AI/ML (artificial intelligence / machine learning) workflows, including whether permission is granted to use an asset in ML training or inference.

:::note
Training and data mining assertions formerly had `c2pa.*` labels.  See [Legacy training and data mining assertion](../reading/legacy.md#legacy-training-and-data-mining-assertion) for more information.
:::

| Entry Key | Whether permission is granted...  | Possible values of `use` property |
|-----------|-------------|-------------|
| `cawg.data_mining` | To extract text or data from the asset for purposes of determining "patterns, trends and correlations," including images containing text, where the text could be extracted via OCR. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |
| `cawg.ai_inference` | To use the asset as input to a trained AI/ML model for the purposes of inferring a result. Sometimes referred to as the "do not infer" assertion. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |
| `cawg.ai_generative_training`  | To use the asset as training data for a generative AI/ML model that could produce derivative assets. Sometimes referred to as the "do not train" assertion. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained`  |
| `cawg.ai_training` |To use the asset to train non-generative AI/ML models, such as those used for classification, object detection, and so on. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |

The value of each of these properties is an object with a `use` property that can have one of these values:

- `allowed`: Permission is granted for this type of use.
- `notAllowed`: Permission is NOT granted for this type of use.
- `constrained`: Permission is not unconditionally granted for this use.  You can provide more details (such as contact information) in the `constraints_info` text property.

For more information, see the [CAWG Training and Data Mining Assertion](https://cawg.io/training-and-data-mining/1.1/#_assertion_definition) technical specification.

For example:

```json
"assertions": [
  ...
  {
    "label": "cawg.training-mining",
    "data": {
      "entries": {
        "cawg.ai_generative_training": { "use": "notAllowed" },
        "cawg.ai_inference": { "use": "notAllowed" },
        "cawg.ai_training": { "use": "notAllowed" },
        "cawg.data_mining": { 
          "use": "constrained",
          "constraint_info" : "Contact foo@bar.com for more information."
        } 
      }
    }
  }
  ...
]
```

## Custom assertions

In addition to the C2PA standard assertions, you can also define custom assertions if the standard assertions don't cover your specific needs.  A custom assertion has a label string with [reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) syntax, for example `com.adobe.product-foo.bar`.

For example:

```json
"assertions": [
  ...
  {
    "label": "com.mycompany.myproduct",
    "data": {
      "git_hash": "023bb51",
      "lib_name": "Our C2PA C++ Library",
      "lib_version": "2.5.1",
      "target_spec_version": "1.2"
    },
    "kind": "Json"
  },
  ...
]
```
