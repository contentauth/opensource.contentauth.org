
Use the [`Reader`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html) struct to read manifest data from a file or stream.

### Reading from a file

Use [`from_file`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_file) to read manifest data from a file:

```rust
use std::{
    io::{Cursor, Write},
    process::{Command, Stdio},
};

use anyhow::Result;
use c2pa::{settings::load_settings_from_str, Builder, CallbackSigner, Reader};
use c2pa_crypto::raw_signature::SigningAlg;
use serde_json::json;

const TEST_IMAGE: &[u8] = include_bytes!("../tests/fixtures/CA.jpg");
const CERTS: &[u8] = include_bytes!("../tests/fixtures/certs/ed25519.pub");
const PRIVATE_KEY: &[u8] = include_bytes!("../tests/fixtures/certs/ed25519.pem");

use c2pa::Reader;
let reader = Reader::from_file("path/to/file.jpg").unwrap();
```

There is also an asynchronous version of this method, [`from_stream_async`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_file_async).

### Reading from a stream

Use [`from_stream`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_stream) to read manifest data from a stream:

```rust
use std::{
    io::{Cursor, Write},
    process::{Command, Stdio},
};

use anyhow::Result;
use c2pa::{settings::load_settings_from_str, Builder, CallbackSigner, Reader};
use c2pa_crypto::raw_signature::SigningAlg;
use serde_json::json;

const TEST_IMAGE: &[u8] = include_bytes!("../tests/fixtures/CA.jpg");
const CERTS: &[u8] = include_bytes!("../tests/fixtures/certs/ed25519.pub");
const PRIVATE_KEY: &[u8] = include_bytes!("../tests/fixtures/certs/ed25519.pem");

let mut stream = Cursor::new(include_bytes!("../tests/fixtures/CA.jpg"));
let reader = Reader::from_stream("image/jpeg", stream).unwrap();
println!("{}", reader.json());
```

There is also an asynchronous version of this method, [`from_stream_async`](https://docs.rs/c2pa/latest/c2pa/struct.Reader.html#method.from_stream_async).
