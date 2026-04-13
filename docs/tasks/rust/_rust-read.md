
Use the [`Reader`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html) struct to read manifest data from a file or stream.

### Reading from a file

Open a file and use [`from_context`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_context) with [`with_stream`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.with_stream) to read manifest data:

```rust
use c2pa::{Context, Reader, Result};
use std::fs::File;

fn main() -> Result<()> {
    let context = Context::new();
    let stream = File::open("path/to/file.jpg")?;
    let reader = Reader::from_context(context)
        .with_stream("image/jpeg", stream)?;
    println!("{}", reader.json());
    Ok(())
}
```

:::tip
The `with_stream()` format parameter accepts either a MIME type or a file extension as an argument.
:::

### Reading from a stream

If you have image bytes from a non-file source such as an HTTP response or a database, wrap them in a `Cursor` to provide the seekable stream that `with_stream` requires:

```rust
use c2pa::{Context, Reader, Result};
use std::io::Cursor;

fn read_manifest_from_bytes(image_bytes: Vec<u8>) -> Result<()> {
    let context = Context::new();
    let reader = Reader::from_context(context)
        .with_stream("image/jpeg", Cursor::new(image_bytes))?;
    println!("{}", reader.json());
    Ok(())
}
```

