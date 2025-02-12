This is how to attach and sign a manifest using Rust.

This example is from [`c2pa-rs/sdk/examples/v2api.rs`](https://github.com/contentauth/c2pa-rs/blob/main/sdk/examples/v2api.rs#L88C5-L134C1):

```rust
let json = manifest_def(title, format);

let mut builder = Builder::from_json(&json)?;
builder.add_ingredient_from_stream(
    json!({
        "title": parent_name,
        "relationship": "parentOf"
    })
    .to_string(),
    format,
    &mut source,
)?;

let thumb_uri = builder
    .definition
    .thumbnail
    .as_ref()
    .map(|t| t.identifier.clone());

// add a manifest thumbnail ( just reuse the image for now )
if let Some(uri) = thumb_uri {
    if !uri.starts_with("self#jumbf") {
        source.rewind()?;
        builder.add_resource(&uri, &mut source)?;
    }
}

// write the manifest builder to a zipped stream
let mut zipped = Cursor::new(Vec::new());
builder.to_archive(&mut zipped)?;

// unzip the manifest builder from the zipped stream
zipped.rewind()?;

let ed_signer =
    |_context: *const (), data: &[u8]| CallbackSigner::ed25519_sign(data, PRIVATE_KEY);
let signer = CallbackSigner::new(ed_signer, SigningAlg::Ed25519, CERTS);

let mut builder = Builder::from_archive(&mut zipped)?;
// sign the ManifestStoreBuilder and write it to the output stream
let mut dest = Cursor::new(Vec::new());
builder.sign(&signer, format, &mut source, &mut dest)?;
```
