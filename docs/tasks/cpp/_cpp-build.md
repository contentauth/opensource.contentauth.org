This is an example of how to assign a manifest to an asset and sign the claim using C++:

```cpp
#include <iostream>
#include <memory>
#include <string>
#include "c2pa.hpp"

using namespace c2pa;

const std::string manifest_json = R"({
    "claim_generator_info": [
      {
        "name": "c2pa-cpp test",
        "version": "0.1"
      }
    ],
    "assertions": [
    {
      "label": "c2pa.training-mining",
      "data": {
        "entries": {
          "c2pa.ai_generative_training": { "use": "notAllowed" },
          "c2pa.ai_inference": { "use": "notAllowed" },
          "c2pa.ai_training": { "use": "notAllowed" },
          "c2pa.data_mining": { "use": "notAllowed" }
        }
      }
    }
  ]
})";

auto context = std::make_shared<c2pa::Context>();
auto builder = c2pa::Builder(context, manifest_json);

Signer signer = c2pa::Signer("es256", certs, private_key, "http://timestamp.digicert.com");
auto manifest_data = builder.sign("source_asset.jpg", "output_asset.jpg", signer);
```
