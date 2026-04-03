
Use the `c2pa.Reader` object to read manifest data from a file or stream and perform validation on the manifest store.

This example shows how to read a C2PA manifest embedded in a media file, and validate that it is trusted according to the official trust anchor certificate list. The output is printed as prettified JSON.

```py
import sys
import json
import urllib.request
from c2pa import Context, Reader, Settings

TRUST_ANCHORS_URL = "https://contentcredentials.org/trust/anchors.pem"

def load_trust_anchors():
    try:
        with urllib.request.urlopen(TRUST_ANCHORS_URL) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Warning: Could not load trust anchors from {TRUST_ANCHORS_URL}: {e}")
        return None


def read_c2pa_data(media_path: str):
    print(f"Reading {media_path}")
    try:
        anchors = load_trust_anchors()
        config = {"verify": {"verify_cert_anchors": True}}
        if anchors:
            config["trust"] = {"trust_anchors": anchors}

        ctx = Context.from_dict(config)
        with Reader(media_path, context=ctx) as reader:
            print(reader.json())
    except Exception as e:
        print(f"Error reading C2PA data from {media_path}: {e}")
        sys.exit(1)


if __name__ == '__main__':
    media_path = sys.argv[1] if len(sys.argv) >= 2 else "tests/fixtures/cloud.jpg"
    read_c2pa_data(media_path)
```
