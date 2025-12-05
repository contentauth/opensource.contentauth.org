
Use the `Reader` object to read manifest data from a file or stream and perform validation on the manifest store. 

Use the `json()` method to return a JSON manifest report; If there are validation errors, the report includes a `validation_status` field.

An asset file may contain many manifests in a manifest store. The most recent manifest is identified by the value of the `active_manifest` field in the manifests map.

```py
# Import the C2PA Python package.
from c2pa import *

# Import standard general-purpose packages.
import os
import io
import logging
import json

try:
  # Create a reader from a file path.
  reader = c2pa.Reader.from_file("path/to/media_file.jpg")

  # Print the JSON for a manifest.
  print("manifest store:", reader.json())

except Exception as err:
    print(err)
```

<!--
May want to add that the `path` param needs to be a valid path (since we don't revalidate in the example), and `mimeType` a valid and supported mimetype (again because in the example we don't revalidate and/or check for undefined/null).
-->