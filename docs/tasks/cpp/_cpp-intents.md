_Intents_ tell the `Builder` what kind of manifest you are creating. They enable validation, add required default actions, and help prevent invalid operations.

### Setting the intent

Set the intent through `Context` settings or by calling `set_intent` on the `Builder`. Using `Context` keeps intent configuration alongside other builder settings:

```cpp
#include "c2pa.hpp"

c2pa::Context context(R"({
    "version": 1,
    "builder": {
        "intent": {"Create": "digitalCapture"},
        "claim_generator_info": {"name": "My App", "version": "1.0"}
    }
})");

c2pa::Builder builder(context, R"({})");
builder.sign(source_path, output_path, signer);
```

Alternatively, call `set_intent` directly on the `Builder`:

```cpp
c2pa::Context context;
c2pa::Builder builder(context, R"({})");
builder.set_intent(Create, DigitalCapture);
builder.sign(source_path, output_path, signer);
```

### Intent types

| Intent | Operation | Parent ingredient | Auto-generated action |
|--------|-----------|-------------------|-----------------------|
| `Create` | Brand-new content | Must NOT have one | `c2pa.created` |
| `Edit` | Modifying existing content | Auto-created from source if not provided | `c2pa.opened` (linked to parent) |
| `Update` | Metadata-only changes | Auto-created from source if not provided | `c2pa.opened` (linked to parent) |

### Create intent

Use the `Create` intent for new digital creations without a parent ingredient. A `C2paDigitalSourceType` is required; common values include `Empty`, `DigitalCapture`, `TrainedAlgorithmicMedia`, and `DigitalCreation`.

```cpp
c2pa::Context context(R"({
    "version": 1,
    "builder": {"intent": {"Create": "trainedAlgorithmicMedia"}}
})");

c2pa::Builder builder(context, R"({})");
builder.sign(source_path, output_path, signer);
```

### Edit intent

Use the `Edit` intent for editing an existing asset. If no parent ingredient has been added, the `Builder` automatically creates one from the source stream passed to `sign()`:

```cpp
c2pa::Context context(R"({
    "version": 1,
    "builder": {"intent": "edit"}
})");

c2pa::Builder builder(context, R"({})");
builder.sign("original.jpg", "edited.jpg", signer);
```

To manually provide the parent ingredient:

```cpp
c2pa::Context context(R"({
    "version": 1,
    "builder": {"intent": "edit"}
})");

c2pa::Builder builder(context, R"({})");

std::ifstream original("original.jpg", std::ios::binary);
builder.add_ingredient(
    R"({"title": "Original Photo", "relationship": "parentOf"})",
    "image/jpeg",
    original
);

builder.sign("canvas.jpg", "edited.jpg", signer);
```

### Update intent

Use the `Update` intent for non-editorial, metadata-only changes. It allows exactly one ingredient (the parent) and does not allow changes to the parent's hashed content:

```cpp
c2pa::Context context(R"({
    "version": 1,
    "builder": {"intent": "update"}
})");

c2pa::Builder builder(context, R"({})");
builder.sign("signed_asset.jpg", "updated_asset.jpg", signer);
```
