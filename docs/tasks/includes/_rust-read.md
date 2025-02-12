
Use the [`Reader`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html) struct to read manifest data from a file or stream.

### Reading from a file

Use [`from_file`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_file) to read manifest data from a file:

```rust
use c2pa::Reader;
let reader = Reader::from_file("path/to/file.jpg").unwrap();
```

There is also an asynchronous version of this method, [`from_stream_async`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_file_async).

### Reading from a stream

Use [`from_stream`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_stream) to read manifest data from a stream:

```rust
use std::io::Cursor;

use c2pa::Reader;
let mut stream = Cursor::new(include_bytes!("../tests/fixtures/CA.jpg"));
let reader = Reader::from_stream("image/jpeg", stream).unwrap();
println!("{}", reader.json());
```

There is also an asynchronous version of this method, [`from_stream_async`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_stream_async).
