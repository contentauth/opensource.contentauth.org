The example below shows how to get resources from manifest data using the Rust library.

Use [`Reader::from_context`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_context) to read a manifest and then use [`resource_to_stream`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.resource_to_stream) to extract binary resources such as thumbnails:

```rust
use c2pa::{Context, Reader, Result};
use std::{fs::File, io::Cursor};

fn main() -> Result<()> {
    let context = Context::new();
    let stream = File::open("path/to/file.jpg")?;
    let reader = Reader::from_context(context)
        .with_stream("image/jpeg", stream)?;

    let mut thumbnail = Cursor::new(Vec::new());
    if let Some(manifest) = reader.active_manifest() {
        if let Some(thumbnail_ref) = manifest.thumbnail_ref() {
            let output_path = format!("thumbnail.{}", thumbnail_ref.format);
            let mut output_file = File::create(output_path)?;
            reader.resource_to_stream(&thumbnail_ref.identifier, &mut output_file)?;
        }
    }
    Ok(())
}
```
