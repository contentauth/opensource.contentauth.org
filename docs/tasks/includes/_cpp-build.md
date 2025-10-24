This is an example of how to assign a manifest to an asset and sign the claim using C++:

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

const std::string manifest_json = R"{
    "claim_generator": "c2pa_c_test/0.1",
    "claim_generator_info": [
      {
        "name": "c2pa-c example",
        "version": "0.1"
      }
    ],
    "assertions": [
    {
      "label": "cawg.training-mining",
      "data": {
        "entries": {
          "cawg.ai_generative_training": { "use": "notAllowed" },
          "cawg.ai_inference": { "use": "notAllowed" },
          "cawg.ai_training": { "use": "notAllowed" },
          "cawg.data_mining": { "use": "notAllowed" }
        }
      }
    }
  ]
 };

auto builder = Builder(manifest_json);
```