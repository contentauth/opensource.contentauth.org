- [Creating a Context](#creating-a-context)
- [Using Context with Reader](#using-context-with-reader)
- [Using Context with Builder](#using-context-with-builder)

:::info
For more details on using `Context` and `Settings` in Rust, see [Python library - Configuring SDK settings](../../docs/c2pa-python/docs/context-settings)
:::


### Creating a Context

The simplest way to create a `Context` is with default settings:

```py
from c2pa import Context

ctx = Context()  # Uses SDK defaults
```

This is appropriate for quick prototyping or when the SDK defaults are acceptable.

#### Creating from inline JSON

```py
from c2pa import Context

try:
    ctx = Context.from_dict({
        "verify": {
            "verify_cert_anchors": True
        },
        "trust": {
            "trust_anchors": "some url"
        }
    })
except Exception as e:
    print(f"Exception loading settings: {e}")
```

#### Creating from a JSON file

```py
import json
from c2pa import Context, Settings

with open("config/settings.json", "r") as f:
    settings = Settings.from_json(f.read())

ctx = Context(settings)
```

### Using Context with Reader

`Reader` uses `Context` to control how it validates manifests and handles remote resources:

- **Verification behavior**: Whether to verify after reading, check trust, and so on.
- **Trust configuration**: Which certificates to trust when validating signatures.
- **Network access**: Whether to fetch remote manifests or OCSP responses.

> [!IMPORTANT]
> `Context` is used only at construction time. `Reader` copies the configuration it needs internally, so the `Context` does not need to outlive the `Reader`. A single `Context` can be reused for multiple `Reader` instances.

```py
ctx = Context.from_dict({"verify": {"remote_manifest_fetch": False}})
reader = Reader("image.jpg", context=ctx)
print(reader.json())
```

Reading an asset from a stream:

```py
with open("image.jpg", "rb") as stream:
    reader = Reader("image/jpeg", stream, context=ctx)
    print(reader.json())
```

### Using Context with Builder

`Builder` uses `Context` to control how it creates and signs C2PA manifests. The `Context` affects:

- **Claim generator information**: Application name, version, and metadata embedded in the manifest.
- **Thumbnail generation**: Whether to create thumbnails, and their size, quality, and format.
- **Action tracking**: Auto-generation of actions like `c2pa.created`, `c2pa.opened`, `c2pa.placed`.
- **Intent**: The purpose of the claim (create, edit, or update).
- **Verification after signing**: Whether to validate the manifest immediately after signing.
- **Signer configuration** (optional): Credentials stored in the context for reuse.

> [!IMPORTANT]
> `Context` is used only when constructing the `Builder`. The `Builder` copies the configuration it needs internally, so the `Context` does not need to outlive the `Builder`. A single `Context` can be reused for multiple `Builder` instances.

```py
ctx = Context.from_dict({
    "builder": {
        "claim_generator_info": {"name": "An app", "version": "0.1.0"},
        "intent": {"Create": "digitalCapture"}
    }
})

builder = Builder(manifest_json, context=ctx)

with open("source.jpg", "rb") as src, open("output.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```