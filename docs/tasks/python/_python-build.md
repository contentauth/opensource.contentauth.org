
This is an example of how to assign a manifest to an asset and sign the claim using Python.

Use a `Builder` object to add a manifest to an asset.

```python
import json
from c2pa import Builder, Context, Signer, C2paSignerInfo, C2paSigningAlg

manifest_json = json.dumps({
    "claim_generator": "python_test/0.1",
    "assertions": []
})

try:
    with open("tests/fixtures/ps256.pub", "rb") as cert_file, \
         open("tests/fixtures/ps256.pem", "rb") as key_file:
        cert_data = cert_file.read()
        key_data = key_file.read()

        signer_info = C2paSignerInfo(
            alg=C2paSigningAlg.PS256,
            sign_cert=cert_data,
            private_key=key_data,
            ta_url=b"http://timestamp.digicert.com"
        )

        with Context() as ctx:
            with Signer.from_info(signer_info) as signer:
                with Builder(manifest_json, ctx) as builder:
                    # Add an ingredient from a stream.
                    ingredient_json = json.dumps({
                        "title": "A.jpg",
                        "relationship": "parentOf"
                    })
                    with open("tests/fixtures/A.jpg", "rb") as ingredient_file:
                        builder.add_ingredient(ingredient_json, "image/jpeg", ingredient_file)

                    # Sign and write to the output file.
                    with open("tests/fixtures/A.jpg", "rb") as source, \
                         open("target/out.jpg", "w+b") as dest:
                        builder.sign(signer, "image/jpeg", source, dest)

except Exception as err:
    print(err)
```
