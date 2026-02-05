```cpp
#include "c2pa.hpp"
// set settings to not generate thumbnails
c2pa::load_settings("{\"builder\": { \"thumbnail\":{\"enabled\": false}}}", "json");
```

Load from a file:

```cpp
#include <fstream>
#include <sstream>
#include <iostream>
#include "c2pa.hpp"

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " /path/to/settings.json\n";
        return 1;
    }

    const std::string settings_path = argv[1];

    std::ifstream in(settings_path);
    if (!in) {
        std::cerr << "Failed to open settings file: " << settings_path << "\n";
        return 1;
    }

    std::ostringstream buffer;
    buffer << in.rdbuf();
    const std::string json = buffer.str();

    try {
        c2pa::load_settings(json, "json");  // format is "json"
        std::cout << "Loaded settings successfully. c2pa version: "
                  << c2pa::version() << "\n";
    } catch (const c2pa::C2paException& e) {
        std::cerr << "Failed to load settings: " << e.what() << "\n";
        return 1;
    }
    return 0;
}
```

Example `settings.json`:

```json
{
  "builder": {
    "thumbnail": { "enabled": false },
    "actions": {
      "auto_placed_action": { "enabled": true }
    }
  }
}
```