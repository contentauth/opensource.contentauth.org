
The example below shows how to get resources from manifest data using the Python library.

To retrieve binary resources such as thumbnails from the manifest data, use the `resource_to_stream` method with the associated `identifier` field value as the URI.

```py
import json
from c2pa import Context, Reader

try:
    with Context() as ctx:
        with Reader("path/to/media_file.jpg", context=ctx) as reader:
            manifest_store = json.loads(reader.json())
            active_manifest_label = manifest_store.get("active_manifest")
            if active_manifest_label:
                manifest = manifest_store["manifests"][active_manifest_label]

                # Get the URI to the manifest's thumbnail and write it to a file.
                uri = manifest["thumbnail"]["identifier"]
                with open("thumbnail_v2.jpg", "w+b") as thumb_file:
                    reader.resource_to_stream(uri, thumb_file)

except Exception as err:
    print(err)
```
