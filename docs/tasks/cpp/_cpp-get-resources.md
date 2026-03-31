This is how to get resources from a manifest using C++.

```cpp
#include <iostream>
#include <fstream>
#include <string>
#include "c2pa.hpp"
#include <nlohmann/json.hpp>

// this example uses nlohmann json for parsing the manifest
using json = nlohmann::json;
using namespace std;
namespace fs = std::filesystem;
using namespace c2pa;

int main()
{
  fs::path output_path = current_dir / "../target/example/training.jpg";
  fs::path thumbnail_path = current_dir / "../target/example/thumbnail.jpg";

  try
      {
          c2pa::Context context;
          auto reader = Reader(context, output_path);

          auto manifest_store_json = reader.json();
          cout << "The new manifest is " << manifest_store_json << endl;

          // get the active manifest
          json manifest_store = json::parse(manifest_store_json);
          if (manifest_store.contains("active_manifest"))
          {
              string active_manifest = manifest_store["active_manifest"];
              json &manifest = manifest_store["manifests"][active_manifest];

              string identifier = manifest["thumbnail"]["identifier"];

              std::ofstream ofs(thumbnail_path, std::ios::binary);
              reader.get_resource(identifier, ofs);

              cout << "thumbnail written to " << thumbnail_path << endl;
          }
      }
      
      catch (c2pa::C2paException const &e)
      {
          cout << "C2PA Error: " << e.what() << endl;
      }
}
```
