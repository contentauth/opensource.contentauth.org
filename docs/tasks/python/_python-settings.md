```py
try:
    settings = {
        "verify": {
            "verify_cert_anchors": True
        },
        "trust": {
            "trust_anchors": "some url"
        }
    }
    c2pa.load_settings(settings)
except Exception as e:
    print(f"Exception loading settings: {e}")
```        