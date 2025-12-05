This is how to setup your code to use the Rust library.

:::tip
The files used in this example are in the C2PA Rust library [`sdk/tests/fixtures`](https://github.com/contentauth/c2pa-rs/tree/main/sdk/tests/fixtures) directory.
:::

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
```