- [Creating a Context](#creating-a-context)
- [Using Context with Reader](#using-context-with-reader)
- [Using Context with Builder](#using-context-with-builder)

:::info
For more details on using `Context` and `Settings` in Rust, see [Rust library - Configuring SDK settings](../../docs/rust-sdk/docs/context-settings)
:::


### Creating a Context

The simplest way to create a `Context` is with default settings:

```rust
use c2pa::Context;

let context = Context::new();
```

#### Loading settings from a file

Load settings from a file using the `with_settings()` method, which automatically detects the format (JSON or TOML):

```rust
use c2pa::{Context, Builder, Result};

fn main() -> Result<()> {
    // From a file
    let context = Context::new()
        .with_settings(include_str!("settings.json"))?;

    // Create builder using context settings
    let builder = Builder::from_context(context);
    Ok(())
}
```

#### Loading settings inline

You can also provide settings inline in either JSON or TOML format. For example, using JSON:

```rust
use c2pa::{Context, Result};

fn main() -> Result<()> {
    // Inline JSON format
    let context = Context::new()
        .with_settings(r#"
          {"verify":
          {"verify_after_sign": true}}
        "#)?;

    Ok(())
}
```

#### Loading settings programmatically

```rust
use c2pa::{Context, Settings, Result};

fn main() -> Result<()> {
    let mut settings = Settings::default();
    settings.verify.verify_after_sign = true;

    let context = Context::new().with_settings(settings)?;
    Ok(())
}
```

### Using Context with Reader

`Reader` uses `Context` to control manifest validation and remote resource fetching:

```rust
use c2pa::{Context, Reader, Result};
use std::fs::File;

fn main() -> Result<()> {
    // Configure context
    let context = Context::new()
        .with_settings(r#"{"verify": {"remote_manifest_fetch": false}}"#)?;

    // Create reader with context
    let stream = File::open("path/to/image.jpg")?;
    let reader = Reader::from_context(context)
        .with_stream("image/jpeg", stream)?;

    println!("{}", reader.json());
    Ok(())
}
```

### Using Context with Builder

`Builder` uses `Context` to configure signing operations. The `Context` automatically creates a signer from settings when needed:

```rust
use c2pa::{Context, Builder, Result};
use std::io::Cursor;
use serde_json::json;

fn main() -> Result<()> {
    // Configure context with signer and builder settings
    let context = Context::new()
        .with_settings(json!({
            "signer": {
                "local": {
                    "alg": "ps256",
                    "sign_cert": "path/to/cert.pem",
                    "private_key": "path/to/key.pem",
                    "tsa_url": "http://timestamp.digicert.com"
                }
            },
            "builder": {
                "claim_generator_info": {"name": "My App"},
                "intent": {"Create": "digitalCapture"}
            }
        }))?;

    // Create builder with context and inline JSON definition
    let mut builder = Builder::from_context(context)
        .with_definition(json!({"title": "My Image"}))?;

    // Save with automatic signer from context
    let mut source = std::fs::File::open("source.jpg")?;
    let mut dest = Cursor::new(Vec::new());
    builder.save_to_stream("image/jpeg", &mut source, &mut dest)?;

    Ok(())
}
```