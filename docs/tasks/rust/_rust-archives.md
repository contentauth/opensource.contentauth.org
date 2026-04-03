_Working stores_ and _archives_ provide a standard way to save and restore the state of a `Builder`.

A **working store** is the editable C2PA manifest state (claims, ingredients, assertions) that has not yet been bound to a final asset. An **archive** is a working store serialized to a file or stream (typically a `.c2pa` file) using the standard JUMBF `application/c2pa` format.

### Saving a working store to an archive

Use `to_archive()` to save a `Builder` to a stream:

```rust
use c2pa::{Context, Builder, Result};
use std::io::Cursor;

fn main() -> Result<()> {
    let context = Context::new()
        .with_settings(include_str!("config.json"))?;

    let mut builder = Builder::from_context(context)
        .with_definition(r#"{"title": "My Image"}"#)?;

    // Save the working store to an archive
    let mut archive = Cursor::new(Vec::new());
    builder.to_archive(&mut archive)?;
    std::fs::write("work.c2pa", archive.get_ref())?;

    Ok(())
}
```

### Restoring a working store from an archive

Use `from_archive` to restore with default `Context`, or `with_archive` to restore into a `Builder` with a custom `Context`:

```rust
use c2pa::{Context, Builder, Result};
use std::io::Cursor;

fn main() -> Result<()> {
    // Restore with default context
    let builder = Builder::from_archive(
        Cursor::new(std::fs::read("work.c2pa")?)
    )?;

    // Or restore with a custom shared context (preserves settings)
    let context = Context::new()
        .with_settings(include_str!("config.json"))?;

    let builder = Builder::from_context(context)
        .with_archive(Cursor::new(std::fs::read("work.c2pa")?))?;

    Ok(())
}
```

### Two-phase workflow

Prepare a manifest in one step, sign it later:

```rust
use c2pa::{Context, Builder, Result};
use serde_json::json;
use std::io::Cursor;

fn prepare() -> Result<()> {
    let context = Context::new()
        .with_settings(include_str!("config.json"))?;

    let mut builder = Builder::from_context(context)
        .with_definition(json!({"title": "Artwork draft"}))?;

    builder.add_ingredient_from_stream(
        json!({"title": "Sketch", "relationship": "parentOf"}).to_string(),
        "image/png",
        &mut std::fs::File::open("sketch.png")?,
    )?;

    let mut archive = Cursor::new(Vec::new());
    builder.to_archive(&mut archive)?;
    std::fs::write("artwork.c2pa", archive.get_ref())?;
    Ok(())
}

fn sign() -> Result<()> {
    let context = Context::new()
        .with_settings(include_str!("config.json"))?;

    let mut builder = Builder::from_context(context)
        .with_archive(Cursor::new(std::fs::read("artwork.c2pa")?))?;

    let mut source = std::fs::File::open("artwork.jpg")?;
    let mut dest = std::fs::File::create("signed_artwork.jpg")?;
    builder.save_to_stream("image/jpeg", &mut source, &mut dest)?;
    Ok(())
}
```

### Capturing an ingredient as an archive

Save validation results by capturing an ingredient into an archive, then reuse it later:

```rust
use c2pa::{Context, Builder, Result};
use serde_json::json;
use std::io::Cursor;

fn main() -> Result<()> {
    let context = Context::new()
        .with_settings(include_str!("config.json"))?;

    let mut builder = Builder::from_context(context)
        .with_definition(json!({"title": "New Image"}))?;

    builder.add_ingredient_from_stream(
        json!({
            "title": "Archived Ingredient",
            "relationship": "componentOf",
            "label": "ingredient_1"
        }).to_string(),
        "application/c2pa",
        &mut Cursor::new(std::fs::read("ingredient.c2pa")?),
    )?;

    builder.add_action(json!({
        "action": "c2pa.placed",
        "parameters": { "ingredientIds": ["ingredient_1"] }
    }))?;

    Ok(())
}
```
