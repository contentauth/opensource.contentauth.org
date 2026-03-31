_Intents_ tell the `Builder` what kind of manifest you are creating. They enable validation, add required default actions, and help prevent invalid operations.

### Setting the intent

Set the intent through `Context` settings. Using `Context` keeps intent configuration alongside other builder settings:

```py
from c2pa import Context, Builder

ctx = Context.from_dict({
    "builder": {
        "intent": {"Create": "digitalCapture"},
        "claim_generator_info": {"name": "My App", "version": "1.0"}
    }
})

builder = Builder(manifest_json, context=ctx)

with open("source.jpg", "rb") as src, open("signed.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

### Intent types

| Intent | Operation | Parent ingredient | Auto-generated action |
|--------|-----------|-------------------|-----------------------|
| `Create` | Brand-new content | Must NOT have one | `c2pa.created` |
| `Edit` | Modifying existing content | Auto-created from source if not provided | `c2pa.opened` (linked to parent) |
| `Update` | Metadata-only changes | Auto-created from source if not provided | `c2pa.opened` (linked to parent) |

### Create intent

Use the `Create` intent for new digital creations without a parent ingredient. A digital source type is required; common values include `"digitalCapture"`, `"trainedAlgorithmicMedia"`, and `"digitalCreation"`.

```py
ctx = Context.from_dict({
    "builder": {"intent": {"Create": "trainedAlgorithmicMedia"}}
})

builder = Builder(manifest_json, context=ctx)
with open("source.jpg", "rb") as src, open("signed.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

### Edit intent

Use the `Edit` intent for editing an existing asset. If no parent ingredient has been added, the `Builder` automatically creates one from the source stream passed to `sign()`:

```py
ctx = Context.from_dict({
    "builder": {"intent": "edit"}
})

builder = Builder(manifest_json, context=ctx)
with open("original.jpg", "rb") as src, open("edited.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

To manually provide the parent ingredient:

```py
import json

ctx = Context.from_dict({
    "builder": {"intent": "edit"}
})

builder = Builder(manifest_json, context=ctx)

ingredient_json = json.dumps({
    "title": "Original Photo",
    "relationship": "parentOf"
})
with open("original.jpg", "rb") as ingredient:
    builder.add_ingredient(ingredient_json, "image/jpeg", ingredient)

with open("canvas.jpg", "rb") as src, open("edited.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```

### Update intent

Use the `Update` intent for non-editorial, metadata-only changes. It allows exactly one ingredient (the parent) and does not allow changes to the parent's hashed content:

```py
ctx = Context.from_dict({
    "builder": {"intent": "update"}
})

builder = Builder(manifest_json, context=ctx)
with open("signed_asset.jpg", "rb") as src, open("updated.jpg", "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)
```
