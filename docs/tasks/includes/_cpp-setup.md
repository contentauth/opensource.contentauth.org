To setup the C++ library:

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
#include <nlohmann/json.hpp>

// this example uses nlohmann json for parsing the manifest
using json = nlohmann::json;
using namespace std;
namespace fs = std::filesystem;
using namespace c2pa;
```