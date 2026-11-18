---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# C2PA Tool FAQs

<TOCInline toc={toc} />

### How can I inspect a file locally using C2PA Tool?

Run C2PA Tool on your local machine:

```sh
c2patool file.jpg
```

This avoids uploading the asset to an online inspection tool such as [ACA Inspect](../getting-started/aca-inspect.mdx).
Some configurations and operations still require network access; for example,
trust initialization fetches trust lists.

<!-- Use CrJSON? -->

### How do I load trust lists with C2PA Tool?

<!--
This originally mentioned setting the TSA Trust List, but the c2patool docs don't mention that.
-->

Enter this command to fetch the [official C2PA trust list](../conformance/trust-lists#c2pa-trust-list) and write it to `c2pa-trust-list.pem` in the same directory as the settings file:

```sh
c2patool init trust
```

Then any C2PA Tool command automatically loads the PEM file and enables trust checks.

You can also load the interim trust list by using the `--legacy` option.
See [Bootstrapping trust files with `init trust`](../sdk-repos/c2patool/docs/usage.md#bootstrapping-trust-files-with-init-trust) for details.  

Additional options provide more granular control; see [Trust subcommand options](../sdk-repos/c2patool/docs/usage.md#trust-subcommand-options).

### How can I override an ingredient's title?

Export a signed asset as an ingredient using the [`--ingredient` option](../sdk-repos/c2patool/docs/usage.md#creating-an-ingredient-from-a-file).
The resulting folder contains ingredient JSON, a thumbnail, and the manifest
binary. Edit the title in the ingredient JSON, then reference the folder
through `ingredient_paths` in the new manifest definition:

```json
"ingredient_paths": ["./ingredient-folder"]
```

Sources:

- [Ingredient export and title workflow; April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499513543291305995)
- [Successful result; May 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499846501948456980)

### How do I supply my own thumbnail?

Add a `thumbnail` object to the manifest definition. Set `identifier` to
the thumbnail's path relative to the manifest definition file:

```json
"thumbnail": {
  "format": "image/jpeg",
  "identifier": "thumbnail.jpg"
}
```

Include this field in a complete manifest definition, then run:

```sh
c2patool sample.mp4 -m manifest.json -o sample-signed.mp4
```

Use the same approach to define ingredient thumbnails.

Source: [custom thumbnails and relative paths, August 31, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1543975786468352150)

### Why does C2PA Tool behave differently when launched by my application versus on the command-line?

Check the executable path and version that your application launches and check the the version available in your terminal.
They might be launching different versions of the tool.

Source: [`#c2pa-tool` channel April 22, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1496644840786624614)

### Can I create sidecar manifests for unsupported file types?

Yes. To read the asset with its sidecar, use:

```sh
c2patool file.obj --external-manifest file.c2pa
```

See [Generating an external manifest](../sdk-repos/c2patool/docs/usage.md#generating-an-external-manifest)
for creating a sidecar, and [Using an external manifest](../sdk-repos/c2patool/docs/usage.md#using-an-external-manifest)
for how `--external-manifest` selects it during validation.

Sources:

- [Implementation; September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549892485080293416)
- [Read command; September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549898982988455988)
- [User confirmation; September 17, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1550145681090412695)
