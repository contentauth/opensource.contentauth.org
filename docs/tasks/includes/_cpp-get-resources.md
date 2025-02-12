This is how to get resources from a manifest using C++.

```cpp
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
          // load the manifest, certs, and private key
      /* Commenting out, because not part of resource reading
          string manifest_json = read_text_file(manifest_path).data();

          string certs = read_text_file(certs_path).data();

          // create a signer
          Signer signer = Signer(&test_signer, Es256, certs, "http://timestamp.digicert.com");

          auto builder = Builder(manifest_json);
          auto manifest_data = builder.sign(image_path, output_path, signer);
      */

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