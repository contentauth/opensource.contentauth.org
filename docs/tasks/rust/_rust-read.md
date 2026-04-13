
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

```rust
use c2pa::{Context, Reader, Result};
use std::io::Cursor;

fn main() -> Result<()> {
    let context = Context::new();
    let image_data = include_bytes!("path/to/file.jpg");
    let reader = Reader::from_context(context)
        .with_stream("image/jpeg", Cursor::new(image_data))?;
    println!("{}", reader.json());
    Ok(())
}
```

There is also a deprecated asynchronous version, [`from_stream_async`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_stream_async).
