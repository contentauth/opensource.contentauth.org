---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# C2PA Tool FAQs

<TOCInline toc={toc} />

### How can I inspect a file locally using C2PA Tool?

Use the open-source C2PA Tool CLI to inspect a file on your own machine:

```sh
c2patool file.jpg --detailed
```

This avoids uploading the asset to a web inspection service. It is not a
promise that every configuration or operation is network-free; for example,
the trust initialization command fetches trust lists. Local
inspection also does not by itself establish that the signer is trusted
or that the depicted content is true.

Source: [Local CLI inspection command; September 11, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1548138360139419719)

### How do I load trust lists with C2PA Tool?

You have to initialize trust lists explicitly. Earlier versions required supplying trust
anchors through settings or the command line. Use `c2patool init trust` to fetch or update trust lists and store them for future calls:

```sh
c2patool init trust
```

Use a raw PEM URL when supplying a trust-anchor link.

For more control, pass a settings file with `--settings`; TOML settings are
passed through to the SDK. Supply the concatenated CA and TSA lists when needed to include TSA intermediate certificates.
Trust sidecars are loaded automatically on subsequent runs from the same
directory as the settings file.

For ingredient validation during signing, configure both the C2PA Trust List
and C2PA TSA Trust List.

Sources:

- [Explicit trust configuration; April 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1488985307343884348)
- [Trust initialization; June 19, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1517556047324250223)
- [Ingredient and timestamp trust; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509239917262405742)
- [Raw PEM URL; August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534942946212708522)
- [Initialization command; August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534943626499719369)
- [Settings option; August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534945015598678176)
- [Persistence and concatenated lists; August 6, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1534995351101116646)

### Does a new manifest automatically inherit its parent's title?

No. The `parentOf` ingredient's title is not automatically assigned to the
new claim's `dc:title`. Without an explicit title in the manifest definition,
the output filename is used.

Set the desired title in the new manifest definition rather than relying on
inheritance. This sets the active manifest's title; changing an ingredient's
title is a separate operation.

Sources:

- [Default title behavior; April 7, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1491244347075727431)
- [Explicit title confirmation; April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499462978687209482)

### How can I override an ingredient's title?

Export a signed asset as an ingredient using the `--ingredient` option.
The resulting folder contains ingredient JSON, a thumbnail, and the manifest binary. Edit the title in the ingredient JSON, then reference the folder through `ingredient_paths` in the new manifest definition like this:

```json
"ingredient_paths": ["./ingredient-folder"]
```

Sources:

- [Ingredient export and title workflow; April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499513543291305995)
- [Successful result; May 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499846501948456980)

### Does the overall validation state describe only the active manifest?

No. `validation_state` also considers ingredient deltas, so an ingredient
failure can affect the overall state.

For the active manifest alone, inspect the success, informational, and
failure arrays in `validation_results.activeManifest`. Do not interpret
an aggregate `Invalid` result as proof that the active manifest itself
has a signature failure.

Display each manifest's state independently and distinguish
valid-but-untrusted manifests from trusted ones. That is
presentation guidance, not a rule that cryptographic validity establishes
signer trust.

Sources:

- [Aggregate state clarification; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509250331320778864)
- [Active-manifest results; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555410921590835)
- [Ingredient deltas; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555776585465907)
- [Per-manifest presentation guidance; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509374914510196737)

### How do I supply my own thumbnail?

Add a `thumbnail` object to the manifest definition. Its `identifier` is
a file path relative to the manifest
definition file:

```json
"thumbnail": {
  "format": "image/jpeg",
  "identifier": "thumbnail.jpg"
}
```

This is a field excerpt to include in a complete manifest definition.
For example:

```sh
c2patool sample.mp4 -m manifest.json -o sample-signed.mp4
```

Use the same approach to define ingredient thumbnails. This
provides an explicit thumbnail; it does not explain or promise automatic
thumbnail generation for every input format.

Source: [custom thumbnails and relative paths, August 31, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1543975786468352150)

### How can I sign a TIFF sample and configure created assertions?

C2PA Tool supports reading and writing TIFF files. For example:

```sh
c2patool sample.tiff \
  --settings settings.toml \
  --manifest manifest.json \
  --output signed.tiff
```

For that command, the source asset becomes a `parentOf`
ingredient and the tool automatically adds the `c2pa.opened` action.
You can omit settings when using the default key and certificate, but do
not assume those defaults are trusted or qualify a product for conformance.

When the implementation needs to designate created rather than gathered
assertions, use settings such as:

```toml
[builder]

created_assertion_labels = [
  "c2pa.actions",
  "c2pa.ingredient"
]
```

This is just an example. Select the assertions appropriate to the implementation. 

Sources:

- [TIFF signing command and defaults; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549488757898616973)
- [Created assertion settings; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549489530598588417)

### Why does C2PA Tool behave differently when launched by my application versus on the command-line?

Check the **actual executable and version** your application launches,
rather than only the version available in your terminal.

For example in the reported case, the application launched C2PA Tool **0.26.1**,
although the user expected **0.26.41**. Launching 0.26.41 resolved the
missing timestamp assertion.

Source: [confirmed resolution, April 22, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1496644840786624614)

### Can I create sidecar manifests for unsupported file types?

Yes. To read the asset with its sidecar, use:

```sh
c2patool file.obj --external-manifest file.c2pa
```

Sources:

- [Implementation; September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549892485080293416)
- [Read command; September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549898982988455988)
- [User confirmation; September 17, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1550145681090412695)

