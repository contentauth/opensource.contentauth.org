
This is an example of how to assign a manifest to an asset and sign the claim using Python.

Use a `Builder` object to add a manifest to an asset.

```python
# Import the C2PA Python package.
from c2pa import *

# Import standard general-purpose packages.
import os
import io
import logging
import json
import base64

try:
  # Define a function to sign the claim bytes.
  # In this case we are using a pre-defined sign_ps256 method, passing in our private cert.
  # Normally this cert would be kept safe in some other location.
  def private_sign(data: bytes) -> bytes:
    return sign_ps256(data, "tests/fixtures/ps256.pem")

  # Read our public certs into memory.
  certs = open(data_dir + "ps256.pub", "rb").read()

  # Create a signer from the private signer, certs and a time stamp service URL.
  signer = create_signer(private_sign, SigningAlg.PS256, certs, "http://timestamp.digicert.com")

  # Create a builder add a thumbnail resource and an ingredient file.
  builder = Builder(manifest_json)

  # Add the resource from a stream.
  a_thumbnail_jpg_stream = open("tests/fixtures/A_thumbnail.jpg", "rb")
  builder.add_resource("image/jpeg", a_thumbnail_jpg_stream)

  # Add the resource from a file.
  # The URI provided here, "thumbnail", must match an identifier in the manifest definition.
  builder.add_resource_file("thumbnail", "tests/fixtures/A_thumbnail.jpg")

  # Define an ingredient, in this case a parent ingredient named A.jpg, with a thumbnail.
  ingredient_json = {
    "title": "A.jpg",
    "relationship": "parentOf", # "parentOf", "componentOf" or "inputTo"
    "thumbnail": {
        "identifier": "thumbnail",
        "format": "image/jpeg"
    }
  }

  # Add the ingredient from a stream.
  a_jpg_stream = open("tests/fixtures/A.jpg", "rb")
  builder.add_ingredient("image/jpeg", a_jpg_stream)

  # At this point archive or unarchive Builder to continue later.
  # This example uses a bytearray for the archive stream.
  # All ingredients and resources are saved in the archive.
  archive = io.BytesIO(bytearray())
  builder.to_archive(archive)
  archive.seek()
  builder = builder.from_archive(archive)

  # Sign the builder with a stream and output it to a stream.
  # This returns the binary manifest data that could be uploaded to cloud storage.
  input_stream = open("tests/fixtures/A.jpg", "rb")
  output_stream = open("target/out.jpg", "wb")
  c2pa_data = builder.sign(signer, "image/jpeg", input_stream, output_stream)

except Exception as err:
  print(err)
```