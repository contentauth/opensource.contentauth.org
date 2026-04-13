
Use the `Reader` constructor to read C2PA data from a file or stream. Pass a shared pointer to a `Context` as the first argument to configure SDK behavior; for the default configuration, use `std::make_shared<c2pa::Context>()`.

### Reading from a file

```cpp
#include "c2pa.hpp"
#include <iostream>
#include <memory>

auto context = std::make_shared<c2pa::Context>();
auto reader = c2pa::Reader(context, "work/media_file.jpg");
std::cout << reader.json() << std::endl;
```

### Reading from a stream

```cpp
#include "c2pa.hpp"
#include <fstream>
#include <iostream>
#include <memory>

auto context = std::make_shared<c2pa::Context>();
std::ifstream ifs("work/media_file.jpg", std::ios::binary);
auto reader = c2pa::Reader(context, "image/jpeg", ifs);
std::cout << reader.json() << std::endl;
```

If there are validation errors, the report includes a `validation_status` field.
