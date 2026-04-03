_Working stores_ and _archives_ provide a standard way to save and restore the state of a `Builder`.

A **working store** is the editable C2PA manifest state (claims, ingredients, assertions) that has not yet been bound to a final asset. An **archive** is a working store serialized to a file or stream (typically a `.c2pa` file) using the standard JUMBF `application/c2pa` format.

### Saving a working store to an archive

Use `to_archive()` to save a `Builder` to a file or stream:

```cpp
#include "c2pa.hpp"
#include <fstream>

c2pa::Context context;
auto builder = c2pa::Builder(context, manifest_json);
builder.add_resource("thumbnail", "thumbnail.jpg");
builder.add_ingredient(ingredient_json, "source.jpg");

// Save working store to archive file
builder.to_archive("manifest.c2pa");

// Or save to a stream
std::ofstream archive_stream("manifest.c2pa", std::ios::binary);
builder.to_archive(archive_stream);
archive_stream.close();
```

### Restoring a working store from an archive

Use `from_archive` to create a new `Builder` from an archive, or `with_archive` to load an archive into an existing `Builder` while preserving its `Context`:

```cpp
#include "c2pa.hpp"
#include <fstream>

// Restore from file (default context)
auto builder = c2pa::Builder::from_archive("manifest.c2pa");

// Or restore with a custom context (preserves settings)
c2pa::Context context(R"({
    "builder": {
        "thumbnail": {"enabled": false}
    }
})");
auto builder = c2pa::Builder(context);
std::ifstream archive_stream("manifest.c2pa", std::ios::binary);
builder.with_archive(archive_stream);
archive_stream.close();

// Sign with the restored working store
builder.sign("asset.jpg", "signed.jpg", signer);
```

### Two-phase workflow

Prepare a manifest in one step, sign it later:

**Phase 1: Prepare**

```cpp
c2pa::Context context;
auto builder = c2pa::Builder(context, manifest_json);
builder.add_resource("thumbnail", "thumb.jpg");
builder.add_ingredient(
    R"({"title": "Sketch", "relationship": "parentOf"})",
    "sketch.png"
);

builder.to_archive("artwork_manifest.c2pa");
```

**Phase 2: Sign**

```cpp
auto builder = c2pa::Builder::from_archive("artwork_manifest.c2pa");

auto signer = c2pa::Signer("Es256", certs, private_key, tsa_url);
builder.sign("artwork.jpg", "signed_artwork.jpg", signer);
```

### Linking an ingredient archive to an action

Use a `label` in the `add_ingredient` call on the signing builder, and reference it in `ingredientIds`:

```cpp
c2pa::Context context;

const std::string manifest_def = R"({
    "claim_generator_info": [{"name": "My App", "version": "0.1.0"}],
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
})";

auto builder = c2pa::Builder(context, manifest_def);

builder.add_ingredient(
    R"({"title": "photo.jpg", "relationship": "componentOf", "label": "my-ingredient"})",
    "ingredient.c2pa"
);

builder.sign("source.jpg", "signed.jpg", signer);
```
