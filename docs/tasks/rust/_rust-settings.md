```rs
use c2pa::{Context, Builder, Result};

fn main() -> Result<()> {
    // Create a Context with settings from a file
    let context = Context::new()
        .with_settings(include_str!("settings.json"))?;
    
    let builder = Builder::from_context(context);
    // ... use builder
    Ok(())
}
```