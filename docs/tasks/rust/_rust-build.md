This is an example of how to assign a manifest to an asset and sign the claim using Rust.

Configure a `Context` with signer settings and use `Builder::from_context` to create and sign a manifest:

```rust
use c2pa::{Context, Builder, Result};
use serde_json::json;
use std::io::Cursor;

fn main() -> Result<()> {
    let settings = json!({
        "signer": {
            "local": {
                "alg": "ps256",
                "sign_cert": "path/to/cert.pem",
                "private_key": "path/to/key.pem",
                "tsa_url": "http://timestamp.digicert.com"
            }
        },
        "builder": {
            "claim_generator_info": { "name": "My App", "version": "1.0" },
            "intent": { "Create": "digitalCapture" }
        }
    });
    
    let context = Context::new()
        .with_settings(settings)?;

    let mut builder = Builder::from_context(context)
        .with_definition(json!({"title": "My Image"}))?;

    let mut source = std::fs::File::open("source.jpg")?;
    let mut dest = Cursor::new(Vec::new());
    builder.save_to_stream("image/jpeg", &mut source, &mut dest)?;

    Ok(())
}
```
