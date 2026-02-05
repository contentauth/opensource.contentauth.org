This is how to get resources from a manifest using C++.

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

string read_text_file(const fs::path &path)
{
    ifstream file(path);
    if (!file.is_open())
    {
        throw runtime_error("Could not open file " + string(path));
    }
    string contents((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
    file.close();
    return contents.data();
}

int main()
{
  fs::path manifest_path = current_dir / "../tests/fixtures/training.json";
  //fs::path certs_path = current_dir / "../tests/fixtures/es256_certs.pem";
  //fs::path image_path = current_dir / "../tests/fixtures/A.jpg";
  fs::path output_path = current_dir / "../target/example/training.jpg";
  fs::path thumbnail_path = current_dir / "../target/example/thumbnail.jpg";

  try
      {
          // read the new manifest and display the JSON
          auto reader = Reader(output_path);

          auto manifest_store_json = reader.json();
          cout << "The new manifest is " << manifest_store_json << endl;

          // get the active manifest
          json manifest_store = json::parse(manifest_store_json);
          if (manifest_store.contains("active_manifest"))
          {
              string active_manifest = manifest_store["active_manifest"];
              json &manifest = manifest_store["manifests"][active_manifest];

              string identifer = manifest["thumbnail"]["identifier"];

              reader.get_resource(identifer, thumbnail_path);

              cout << "thumbnail written to" << thumbnail_path << endl;
          }
      }
      
      catch (c2pa::Exception const &e)
      {
          cout << "C2PA Error: " << e.what() << endl;
      }

      catch (runtime_error const &e)
      {
          cout << "setup error" << e.what() << endl;
      }

      catch (json::parse_error const &e)
      {
          cout << "parse error " << e.what() << endl;
      }
}
```