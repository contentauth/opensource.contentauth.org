- [Creating a Context](#creating-a-context)
- [Using Context with Reader](#using-context-with-reader)
- [Using Context with Builder](#using-context-with-builder)

:::info
For more details on using `Context` and `Settings` in Rust, see [C++ library - Configuring SDK settings](../../docs/c2pa-cpp/docs/context-settings)
:::

### Creating a Context

The simplest way to create a `Context`  is with SDK default settings:

```cpp
#include "c2pa.hpp"

c2pa::Context context;  // Uses SDK defaults

// Use with Reader or Builder
c2pa::Reader reader(context, "image.jpg");
c2pa::Builder builder(context, manifest_json);
```

#### Creating from inline JSON

To specify a simple configuration that doesn't need to be shared across the codebase, you can use inline JSON like this:

```cpp
c2pa::Context context(R"({
  "version": 1,
  "verify": {"verify_after_sign": true},
  "builder": {"claim_generator_info": {"name": "My App"}}
})");
```

#### Creating from a Settings object

To specify a configuration that needs runtime logic or incremental construction, use a Settings object like this:

```cpp
c2pa::Settings settings;
settings.set("builder.thumbnail.enabled", "false");
settings.set("verify.verify_after_sign", "true");
settings.update(R"({"builder": {"claim_generator_info": {"name": "My App"}}})");

c2pa::Context context(settings);
```

#### Creating using ContextBuilder

To load a configuration from files or combine multiple configuration sources, use `ContextBuilder`. Don't use if you have a single configuration source, since direct construction is simpler.

```cpp
c2pa::Settings base_settings;
base_settings.set("builder.thumbnail.enabled", "true");

auto context = c2pa::Context::ContextBuilder()
    .with_settings(base_settings)
    .with_json(R"({"verify": {"verify_after_sign": true}})")
    .with_json_settings_file("config/overrides.json")
    .create_context();
```

### Using Context with Reader

`Reader` uses `Context` to control validation, trust configuration, network access, and performance.
Since `Context` is used only at construction, `Context` doesn't need to outlive the `Reader`.

#### Reading an asset from a file

```cpp
c2pa::Context context(R"({
  "version": 1,
  "verify": {
    "remote_manifest_fetch": false,
    "ocsp_fetch": false
  }
})");

c2pa::Reader reader(context, "image.jpg");
std::cout << reader.json() << std::endl;
```

#### Reading an asset from a stream

```cpp
std::ifstream stream("image.jpg", std::ios::binary);
c2pa::Reader reader(context, "image/jpeg", stream);
std::cout << reader.json() << std::endl;
```

### Using Context with Builder

`Builder` uses `Context` to control manifest creation, signing, thumbnails, and more.
`Context` doesn't need to outlive the `Builder`, since its used only at construction.

Once you've created a `Context`, you use it with `Builder` like this:

```cpp
...
c2pa::Builder builder(context, manifest_json);

// Pass signer explicitly at signing time
c2pa::Signer signer("es256", certs, private_key);
builder.sign(source_path, output_path, signer);
```


