_Working stores_ and _archives_ provide a standard way to save and restore the state of a `Builder`.

A **working store** is the editable C2PA manifest state (claims, ingredients, assertions) that has not yet been bound to a final asset. An **archive** is a working store serialized to a file or stream (typically a `.c2pa` file) using the standard JUMBF `application/c2pa` format.

### Saving a working store to an archive

Use `to_archive()` to save a `Builder` to a stream:

```py
import io
import json
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {
        "claim_generator_info": {"name": "My App", "version": "0.1.0"}
    }
})

builder = Builder(manifest_json, context=ctx)

with open("thumbnail.jpg", "rb") as thumb:
    builder.add_resource("thumbnail", thumb)

ingredient_json = json.dumps({
    "title": "Original asset",
    "relationship": "parentOf"
})
with open("source.jpg", "rb") as ingredient:
    builder.add_ingredient(ingredient_json, "image/jpeg", ingredient)

# Save working store to archive
archive = io.BytesIO()
builder.to_archive(archive)

# Write to a file
with open("manifest.c2pa", "wb") as f:
    archive.seek(0)
    f.write(archive.read())
```

### Restoring a working store from an archive

Use `with_archive()` to load an archive into a `Builder` while preserving its `Context`:

```py
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {
        "thumbnail": {"enabled": False},
        "claim_generator_info": {"name": "My App", "version": "0.1.0"}
    }
})

# Create builder with context, then load archive into it
with open("manifest.c2pa", "rb") as archive:
    builder = Builder({}, context=ctx)
    builder.with_archive(archive)

# The builder has the archived manifest definition
# but keeps the context settings
with open("asset.jpg", "rb") as src, open("signed.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

### Two-phase workflow

Prepare a manifest in one step, sign it later:

**Phase 1: Prepare**

```py
import io
import json
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {
        "claim_generator_info": {"name": "My App", "version": "0.1.0"}
    }
})

manifest_json = json.dumps({
    "title": "Artwork draft",
    "assertions": []
})

builder = Builder(manifest_json, context=ctx)

with open("thumb.jpg", "rb") as thumb:
    builder.add_resource("thumbnail", thumb)
with open("sketch.png", "rb") as sketch:
    builder.add_ingredient(
        json.dumps({"title": "Sketch"}), "image/png", sketch
    )

with open("artwork_manifest.c2pa", "wb") as f:
    builder.to_archive(f)
```

**Phase 2: Sign**

```py
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {"thumbnail": {"enabled": False}}
})

with open("artwork_manifest.c2pa", "rb") as archive:
    builder = Builder({}, context=ctx)
    builder.with_archive(archive)

with open("artwork.jpg", "rb") as src, open("signed_artwork.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

### Linking an ingredient archive to an action

Use a `label` in the `add_ingredient()` call on the signing builder, and reference it in `ingredientIds`:

```py
import json
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {
        "claim_generator_info": {"name": "My App", "version": "0.1.0"}
    }
})

manifest_json = json.dumps({
    "assertions": [{
        "label": "c2pa.actions.v2",
        "data": {
            "actions": [{
                "action": "c2pa.placed",
                "parameters": {
                    "ingredientIds": ["my-ingredient"]
                }
            }]
        }
    }]
})

builder = Builder(manifest_json, context=ctx)

with open("ingredient.c2pa", "rb") as archive:
    builder.add_ingredient(
        json.dumps({
            "title": "photo.jpg",
            "relationship": "componentOf",
            "label": "my-ingredient"
        }),
        "application/c2pa",
        archive
    )

with open("source.jpg", "rb") as src, open("signed.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```
