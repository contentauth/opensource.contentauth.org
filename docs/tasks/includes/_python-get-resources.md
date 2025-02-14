
The example below shows how to get resources from manifest data using the Python library.

Retrieve binary resources such as thumbnails from the manifest data, use the `resource_to_stream` or `resource_to_file` methods using the associated `identifier` field values and a `uri`.

_NOTE: Need to add example of using `reader.resource_to_stream()`._

```python
try:
# Create a reader from a file path
reader = c2pa.Reader.from_file("path/to/media_file.jpg")

# Get the active manifest.
manifest = reader.get_active_manifest()
if manifest != None:

  # get the uri to the manifest's thumbnail and write it to a file
  uri = manifest["thumbnail"]["identifier"]
  reader.resource_to_file(uri, "thumbnail_v2.jpg")

except Exception as err:
  print(err)
```