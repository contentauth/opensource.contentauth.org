---
id: legacy-manifests
title: Reading legacy manifest data
---

As much as possible, an application should **write** manifest data that conforms to the recent [version 2.2](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html) C2PA technical specification, but should be able to **read and validate** manifest data that conforms to earlier versions of the specification.  This ensures that your application is "backward-compatible" and can still validate older assets with claims that were written in the past.

## Legacy ingredients

Old manifests may contain these kinds of deprecated ingredient data:

- V1 ingredients, with labels that begin with `c2pa.ingredient`.
- V2 ingredients, with labels that begin with `c2pa.ingredient.v2`.

While these labels will show up so you can detect them, the API will return the same ingredient object for all of them, but the field contents may vary depending on the version.


## Legacy actions

Existing manifests may contain two versions of actions: original v1 actions, with label `c2pa.actions`, and revised v2 actions, with label `c2pa.actions.v2`. While a v1 action is fully specified in its actions array, a v2 action may either be fully specified in an element of the actions array or it may be derived from an element in the templates array with the same action name.

As with Ingredients, a single `Actions` object handles both versions of actions. The label will be different for each version, and you may want to to check for both labels or use `starts_with`. 

<!-- 
FROM GAVIN:
The rules for parsing actions templates needs to be added somewhere along with how to handle localizations.

I think we need to provide an action resolver for this.
-->

## Legacy metadata assertions

Existing manifests may contain individual assertions for each metadata standard:

- [Exif assertion](#exif-assertion)
- [IPTC metadata assertion](#iptc-metadata-assertion)
- [Creative Work assertion](#creative-work-assertion)

In the latest version of the SDK, Exif and IPTC assertions are now CAWG assertions, and the CreativeWork assertion is not supported at all.

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

See also [IPTC Photo Metadata User Guide](https://www.iptc.org/std/photometadata/documentation/userguide/).

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

### Creative work assertion

The deprecated creative work metadata assertion has the label `stds.schema-org.CreativeWork`.

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

## Legacy training and data mining assertion

Old manifests may have training and data mining assertions with the following entry keys:

- `c2pa.data_mining`
- `c2pa.ai_training`
- `c2pa.ai_generative_training`
- `c2pa.ai_inference`

These assertions have been replaced by [CAWG training and data mining assertions](../writing/assertions-actions.md#cawg-training-and-data-mining-assertion) with `cawg.*` entry keys. 