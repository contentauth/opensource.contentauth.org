The example below shows how to get resources from manifest data using the Rust library.

_NOTE: Need to clarify if/how these two code examples work together._

This is from [`resource_to_stream`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.resource_to_stream) API doc:

```rust
use c2pa::Reader;
let stream = std::io::Cursor::new(Vec::new());
let reader = Reader::from_file("path/to/file.jpg").unwrap();
let manifest = reader.active_manifest().unwrap();
let uri = &manifest.thumbnail_ref().unwrap().identifier;
let bytes_written = reader.resource_to_stream(uri, stream).unwrap();
```

This is from [`c2pa-rs/examples/v2api.rs`](https://github.com/contentauth/c2pa-rs/blob/main/sdk/examples/v2api.rs#L138):

```rust
let reader = Reader::from_stream(format, &mut dest)?;

// extract a thumbnail image from the ManifestStore
let mut thumbnail = Cursor::new(Vec::new());
if let Some(manifest) = reader.active_manifest() {
    if let Some(thumbnail_ref) = manifest.thumbnail_ref() {
        reader.resource_to_stream(&thumbnail_ref.identifier, &mut thumbnail)?;
        println!(
            "wrote thumbnail {} of size {}",
            thumbnail_ref.format,
            thumbnail.get_ref().len()
        );
    }
}
```