
This is an example of how to assign a manifest to an asset and sign the claim using Python.

Use a `Builder` object to add a manifest to an asset.

```python
try:
  # Define a function to sign the claim bytes
  # In this case we are using a pre-defined sign_ps256 method, passing in our private cert
  # Normally this cert would be kept safe in some other location
  def private_sign(data: bytes) -> bytes:
    return sign_ps256(data, "tests/fixtures/ps256.pem")

  # read our public certs into memory
  certs = open(data_dir + "ps256.pub", "rb").read()

  # Create a signer from the private signer, certs and a time stamp service url
  signer = create_signer(private_sign, SigningAlg.PS256, certs, "http://timestamp.digicert.com")

  # Create a builder add a thumbnail resource and an ingredient file.
  builder = Builder(manifest_json)

  # Add the resource from a stream
  a_thumbnail_jpg_stream = open("tests/fixtures/A_thumbnail.jpg", "rb")
  builder.add_resource("image/jpeg", a_thumbnail_jpg_stream)

  # Add the resource from a file
  # The URI provided here, "thumbnail", must match an identifier in the manifest definition.
  builder.add_resource_file("thumbnail", "tests/fixtures/A_thumbnail.jpg")

  # Define an ingredient, in this case a parent ingredient named A.jpg, with a thumbnail
  ingredient_json = {
    "title": "A.jpg",
    "relationship": "parentOf", # "parentOf", "componentOf" or "inputTo"
    "thumbnail": {
        "identifier": "thumbnail",
        "format": "image/jpeg"
    }
  }

  # Add the ingredient from a stream
  a_jpg_stream = open("tests/fixtures/A.jpg", "rb")
  builder.add_ingredient("image/jpeg", a_jpg_stream)

  # At this point we could archive or unarchive our Builder to continue later.
  # In this example we use a bytearray for the archive stream.
  # all ingredients and resources will be saved in the archive
  archive = io.BytesIO(bytearray())
  builder.to_archive(archive)
  archive.seek()
  builder = builder.from_archive(archive)

  # Sign the builder with a stream and output it to a stream
  # This returns the binary manifest data that could be uploaded to cloud storage.
  input_stream = open("tests/fixtures/A.jpg", "rb")
  output_stream = open("target/out.jpg", "wb")
  c2pa_data = builder.sign(signer, "image/jpeg", input_stream, output_stream)

except Exception as err:
  print(err)
```

FROM SIGNING:

```python
request_data = ... # This is the asset being signed
content_type = ... # MIME type of the asset

manifest = json.dumps({
    "title": "image.jpg",
    "format": "image/jpeg",
    "claim_generator_info": [
        {
            "name": "Documentation example",
            "version": "0.0.1"
        }
    ],
    "assertions": [
        {
            "label": "c2pa.actions",
            "data": {
                "actions": [
                    {
                        "action": "c2pa.edited",
                        "softwareAgent": {
                            "name": "C2PA Python Example",
                            "version": "0.1.0"
                        }
                    }
                ]
            }
        }
    ]
})

try:
  builder = Builder(manifest)

  signer = create_signer(kms_sign, signing_alg,
                        cert_chain, timestamp_url)

  result = io.BytesIO(b"")
  builder.sign(signer, content_type, io.BytesIO(request_data), result)

  return result.getvalue()
except Exception as e:
    logging.error(e)
    abort(500, description=e)
```