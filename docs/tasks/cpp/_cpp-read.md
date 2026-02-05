
Use the `read_file` function to read C2PA data from the specified file. This function examines the specified asset file for C2PA data and returns a JSON report if it finds any; it throws exceptions on errors. If there are validation errors, the report includes a `validation_status` field.

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <stdexcept>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/err.h>
#include "c2pa.hpp"
#include "test_signer.hpp"

using namespace std;
namespace fs = std::filesystem;
using namespace c2pa;

auto json_store = C2pa::read_file("work/media_file.jpg", "output/data_dir")
```

Where:

- `work/media_file.jpg` is the asset file to read.
- `output/data_dir` is the optional path to data output directory; If provided, the function extracts any binary resources, such as thumbnails, icons, and C2PA data into that directory. These files are referenced by the identifier fields in the manifest store report.
