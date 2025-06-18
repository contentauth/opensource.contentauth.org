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

## Legacy metadata assertions

Starting with version 2.2 the C2PA specification, provides for a category of metadata assertions that have a standardized serialization.  Earlier versions had individual assertions for each metadata standard, as detailed below.

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