
Use the `read_file` function to read C2PA data from the specified file. This function examines the specified asset file for C2PA data and returns a JSON report if it finds any; it throws exceptions on errors. If there are validation errors, the report includes a `validation_status` field.

```cpp
auto json_store = C2pa::read_file("<ASSET_FILE>", "<DATA_DIR>")
```

Where:

- `<ASSET_FILE>`- The asset file to read.
- `<DATA_DIR>` - Optional path to data output directory; If provided, the function extracts any binary resources, such as thumbnails, icons, and C2PA data into that directory. These files are referenced by the identifier fields in the manifest store report.

For example:

```cpp
auto json_store = C2pa::read_file("work/media_file.jpg", "output/data_dir")
```