### Setting the intent

Set the intent through `Context` settings or by calling `set_intent` on the `Builder`. Using `Context` keeps intent configuration alongside other builder settings:

```rust
use c2pa::{Context, Builder, Result};

fn main() -> Result<()> {
    let context = Context::new()
        .with_settings(r#"{
            "builder": {
                "intent": {"Create": "digitalCapture"},
                "claim_generator_info": {"name": "My App", "version": "1.0"}
            }
        }"#)?;

    let mut builder = Builder::from_context(context)
        .with_definition(r#"{"title": "New Image"}"#)?;

    let mut source = std::fs::File::open("source.jpg")?;
    let mut dest = std::fs::File::create("signed.jpg")?;
    builder.save_to_stream("image/jpeg", &mut source, &mut dest)?;
    Ok(())
}
```

Alternatively, call `set_intent` directly on the `Builder`:

```rust
use c2pa::{Builder, BuilderIntent, DigitalSourceType};

builder.set_intent(BuilderIntent::Create(DigitalSourceType::DigitalCapture));
```

### Create intent

Use `BuilderIntent::Create(DigitalSourceType)` for new digital creations without a parent ingredient. A `DigitalSourceType` is required; common values include `Empty`, `DigitalCapture`, `TrainedAlgorithmicMedia`, and `DigitalCreation`.

```rust
builder.set_intent(BuilderIntent::Create(DigitalSourceType::TrainedAlgorithmicMedia));
```

### Edit intent

Use `BuilderIntent::Edit` for editing an existing asset. If no parent ingredient has been added, the `Builder` automatically derives one from the source stream:

```rust
use serde_json::json;

builder.set_intent(BuilderIntent::Edit);
builder.add_ingredient_from_stream(
    json!({"title": "Original", "relationship": "parentOf"}).to_string(),
    "image/jpeg",
    &mut source_stream,
)?;
```

### Update intent

Use `BuilderIntent::Update` for non-editorial, metadata-only changes. It allows exactly one ingredient (the parent) and does not allow changes to the parent's hashed content:

```rust
builder.set_intent(BuilderIntent::Update);
```
