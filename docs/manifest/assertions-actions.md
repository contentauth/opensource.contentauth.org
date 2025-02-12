---
id: assertions-actions
title: Assertions and actions
---

## Assertions

Assertions provide information about when, where, and how an asset was created or transformed. 

In the JSON manifest, each assertion is specified by a [ManifestAssertion](../manifest/manifest-ref.mdx#manifestassertion) object.  All the assertions in the manifest are in the `assertions` array. A ManifestAssertion object has two required properties, `label`, a string, and `data`, which can contain arbitrary information; and two optional properties, `kind` and `instance`. 

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

**Metadata assertions**

_Metadata assertions_ include
- [Creative work](#creative-work-assertion)
- [Exchangeable image file (Exif) information](#exif-assertion)
- [IPTC photo and video metadata](#iptc-metadata-assertion)

Metadata assertions must include one or more `@context` properties in the `data` object, as explained in the [JSON-LD](https://www.w3.org/TR/json-ld/#the-context) specification.  Follow the examples shown in each section.

### C2PA standard assertions

The C2PA Technical Specification defines a [set of standard assertions](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_standard_c2pa_assertion_summary) and their corresponding labels.  In addition, you can define [custom assertions](#custom-assertions) for your specific application.

The following table summarizes some of the most important standard assertions.

| Assertion | Label | Description |
|-----------|-------|-------------|
| [Actions](#actions) |  `c2pa.actions` | Creation, edits, and other actions on an asset, such as cropping, color or contrast adjustment, and so on. |
| ["Do not train"](#do-not-train-assertion) | `c2pa.training-mining` | Whether the creator/owner of an asset grants permission to use it for data mining or AI/ML training.  |
| [Creative work](#creative-work-assertion) | `stds.schema-org.CreativeWork`  | Indicates the asset is the product of creative effort.   |
| [Exif information](#exif-assertion) | `stds.exif` | Camera information such as maker, lens stored in Exchangeable image file format (Exif). |
| [Content bindings](#content-bindings) | `c2pa.hash.*`, `c2pa.soft-binding`, etc. | Uniquely identify portions of an asset and bind the assertion to it, for example using cryptographic hashes. |
| [IPTC photo and video metadata](#iptc-metadata) | `stds.iptc` | Properties from the IPTC Photo and Video Metadata Standards, describing for example ownership, rights, and other metadata about a image or video asset. |

:::note
The CAI SDK handles assertions for thumbnails, content bindings, and ingredients, so normally you don't need to think about them.
:::

### Do not train assertion

Assertions with the `c2pa.training-mining` label indicate whether permission is granted to use an asset in data mining, machine learning (ML) training, or inference.   The latter is sometimes referred to as the "do not infer" assertion.

| Entry Key | Whether permission is granted...  | Possible values of `use` property |
|-----------|-------------|-------------|
| `c2pa.data_mining` | To extract text or data from the asset for purposes of determining "patterns, trends and correlations," including images containing text, where the text could be extracted via OCR. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |
| `c2pa.ai_training` |To use the asset to train non-generative AI/ML models, such as those used for classification, object detection, and so on. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |
| `c2pa.ai_generative_training`  | To use the asset as training data for a generative AI/ML model that could produce derivative assets. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained`  |
| `c2pa.ai_inference` | To use the asset as input to a trained AI/ML model for the purposes of inferring a result. Sometimes referred to as the "do not infer" assertion. | `allowed`,<br/>  `notAllowed`,<br/>or `constrained` |

The value of each of these properties is an object with a `use` property that can have one of these values:

- `allowed`: Permission is granted for this type of use.
- `notAllowed`: Permission is NOT granted for this type of use.
- `constrained`: Permission is not unconditionally granted for this use.  You can provide more details (such as contact information) in the `constraints_info` text property.

For more information, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_training_and_data_mining).

For example:

```json
"assertions": [
  ...
  {
    "label": "c2pa.training-mining",
    "data": {
      "entries": {
        "c2pa.ai_generative_training": { "use": "notAllowed" },
        "c2pa.ai_inference": { "use": "notAllowed" },
        "c2pa.ai_training": { "use": "notAllowed" },
        "c2pa.data_mining": { 
          "use": "constrained",
          "constraint_info" : "Contact foo@bar.com for more information."
        } 
      }
    }
  }
  ...
]
```

### Creative work assertion

A creative work assertion states that an asset was the product of creative effort, such as an original photograph or artwork. [Schema.org](https://schema.org/) provides a set of types and metadata fields, including [CreativeWork](https://schema.org/CreativeWork), which describes a representation of creative effort. This assertion provides information about the asset, including who created it and the date/time of publication.  

A creative work assertion has the label `stds.schema-org.CreativeWork`.

For example:

```json
...
"assertions": [
  ...
  {
    "label": "stds.schema-org.CreativeWork",
    "data": {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "url": "https://stock.adobe.com/615559889"
    },
    "kind": "Json"
  },
  ...
]
```

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
Do not use the IPTC `plus:DataMining` property to specify whether permission is granted to use an asset in data mining or AI/ML training. Instead use the C2PA ["do not train" assertion](#do-not-train-assertion).
:::

For a summary reference to IPTC metadata properties, see [IPTC properties](iptc-properties).

See also:
- [Exploring c2patool and IPTC Photo Metadata](https://iptc.atlassian.net/wiki/spaces/PMD/pages/613613569/Exploring+c2patool+and+IPTC+Photo+Metadata) (Aug 2022).
- [IPTC Photo Metadata User Guide](https://www.iptc.org/std/photometadata/documentation/userguide/)

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

### Content bindings

Content bindings are standard assertions such as `c2pa.hash.boxes` and `c2pa.hash.data` that uniquely identify portions of an asset.  For more information on content bindings, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_binding_to_content).

:::note
The CAI SDK writes content bindings assertions, so normally you don't need to write them, just read them.
:::

For example, the `c2pa.hash.data` assertion shown in the [detailed manifest example](examples.mdx/#detailed-manifest) specifies an exclusion hash:

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

### Custom assertions

In addition to the C2PA standard assertions, you can also define custom assertions if the standard assertions don't cover your specific needs.  A custom assertion has a label string with [reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) syntax, for example `com.adobe.product-foo.bar`.

For example:

```json
"assertions": [
  ...
  {
    "label": "com.truepic.libc2pa",
    "data": {
      "git_hash": "023bb51",
      "lib_name": "Truepic C2PA C++ Library",
      "lib_version": "2.5.1",
      "target_spec_version": "1.2"
    },
    "kind": "Json"
  },
  ...
]
```

## Actions

An action is an assertion that provides information about creation, edits, and other things that have occurred to an asset. In the manifest, an `actions` assertion is an array of [ManifestAssertion](manifest-ref.mdx#manifestassertion) objects.   For example:

```json
...
"assertions": [
  {
    "label": "c2pa.actions",
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
| `parameters` | No | Additional information describing the action; see [Parameters](#parameters) | Reference to ingredients in the `org.cai.ingredientIds` array. |

### Action names

The value of the `action` property must be either one of the pre-defined [standard C2PA action strings](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_actions) of the form `c2pa.*` or a custom action name. The set of standard C2PA actions includes fundamental ones as `c2pa.created` for when an asset is first created, and others (`c2pa.cropped`, `c2pa.resized`, and so on) for when an asset's content is modified in some way.  

For the complete list of standard actions, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_actions).


### Digital source type

Use the `digitalSourceType` property to specify how an asset was created or modified, for example "digital capture", "digitized from negative," or "trained algorithmic media." 

The value of `digitalSourceType` is one of the URLs specified by the International Press Telecommunications Council (IPTC) [NewsCodes Digital Source Type scheme](https://cv.iptc.org/newscodes/digitalsourcetype/) of the form `http://cv.iptc.org/newscodes/digitalsourcetype/negativeFilm/<CODE>`, where `<CODE>` is one of the codes shown in the following table.

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
    "label": "c2pa.actions",
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

When creating an actions assertion that has an associated ingredient, the `parameters` object must include a `org.cai.ingredientIds` property with an array of one or more [`instanceID` values](#the-instanceid-property) from ingredients. This is how you associate an action with one or more ingredients. 

:::info
The [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_parameters) requires that a `c2pa.transcoded`, `c2pa.repackaged`, `c2pa.opened`, or a `c2pa.placed` action have one or more associated ingredients, so it is very important to add the `org.cai.ingredientIds` parameter with a matching ingredient.
:::

For example:

```json
"actions": [
  {
    "action": "c2pa.opened",
    "parameters": {
      "org.cai.ingredientIds": [
        "xmp.iid:813ee422-9736-4cdc-9be6-4e35ed8e41cb"
      ]
    }
  },
  ...
```

The SDK supports the older `ingredientId` field, but it is deprecated and will at some point not be supported.

For more information on action parameters, see the [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_parameters).

### The instanceId property

The `instanceId` property identifies an ingredient (with a matching value of `instance_id`) used in an action and is only used when defining/writing a manifest, not reading one.

```json 
"ingredients": [
  {
    ...
    "instance_id": "<String-instance-ID-of-ingredient>",
    ...
  },
...
"actions": [
  {
    "action": "c2pa.*",
    "instanceId": "<String-instance-ID-of-ingredient>",
    "parameters": {
      "ingredient": {
        "hash": "tTBD4/E0R0AjLUdJFpsVz3lE/KJUq22Vz0UGqzhEpVs=",
        "url": "self#jumbf=c2pa.assertions/c2pa.ingredient"
      }
    }
  },
  ...
]
```

For example, the following action identifies that the `c2pa.opened` action was performed on the ingredient with ID `xmp.did:813ee422-9736-4cdc-9be6-4e35ed8e41cb`:

```json
"ingredients": [
  {
    "title": "A.jpg",
    "format": "image/jpeg",
    "document_id": "xmp.did:813ee422-9736-4cdc-9be6-4e35ed8e41cb",
    "instance_id": "xmp.iid:813ee422-9736-4cdc-9be6-4e35ed8e41cb",
    "thumbnail": {
      "format": "image/jpeg",
      "identifier": "xmp.iid-813ee422-9736-4cdc-9be6-4e35ed8e41cb.jpg"
    },
    "relationship": "parentOf"
  },
  ...
],
"assertions": [
  ...
  {
    "label": "c2pa.actions",
    "data": {
      "actions": [
        {
          "action": "c2pa.opened",
          "instanceId": "xmp.iid:813ee422-9736-4cdc-9be6-4e35ed8e41cb",
          "parameters": {
            "ingredient": {
              "hash": "tTBD4/E0R0AjLUdJFpsVz3lE/KJUq22Vz0UGqzhEpVs=",
              "url": "self#jumbf=c2pa.assertions/c2pa.ingredient"
            }
          }
        },
        ...
      ]
    }
  }
],
...
```

### V2 actions

This documentation covers C2PA v1 actions.  The [C2PA Technical Specification](https://c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html#_actions) also describes expanded v2 actions.  V1 actions are fully specified in the actions array. However, a v2 action may either be specified by an element of the actions array or from an element in the templates array with the same action name.

There are some additional differences between v1 and v2 actions, for example in v2, `softwareAgent` is a [ClaimGeneratorInfo](../manifest/manifest-ref#claimgeneratorinfo) structure instead of a string. The CAI APIs can read all v2 actions and write most v2 actions.
