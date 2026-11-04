---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# C2PA Tool FAQs

<TOCInline toc={toc} />

### How can I inspect a file locally using C2PA Tool?

Run C2PA Tool on your local machine:

```sh
c2patool file.jpg --detailed
```

This command avoids uploading the asset to a web inspection service.
Some configurations and operations still require network access; for example,
trust initialization fetches trust lists. Local inspection alone does not
establish that the signer is trusted or that the depicted content is true.

Source: [Local CLI inspection command; September 11, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1548138360139419719)

### How do I load trust lists with C2PA Tool?

Run `c2patool init trust` to fetch or update trust lists and store them for
subsequent runs:

```sh
c2patool init trust
```

Trust lists must be initialized explicitly. Earlier versions required trust
anchors to be supplied through settings or the command line.

Use a raw PEM URL when supplying a trust-anchor link.

For more control, pass a settings file with `--settings`; TOML settings are
passed through to the SDK. Concatenate the certificate authority (CA) and
timestamp authority (TSA) lists when needed to include TSA intermediate
certificates.
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
The resulting folder contains ingredient JSON, a thumbnail, and the manifest
binary. Edit the title in the ingredient JSON, then reference the folder
through `ingredient_paths` in the new manifest definition:

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

Display each manifest's state independently, distinguishing valid-but-untrusted
manifests from trusted ones. Cryptographic validity alone does not establish
signer trust.

Sources:

- [Aggregate state clarification; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509250331320778864)
- [Active-manifest results; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555410921590835)
- [Ingredient deltas; May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555776585465907)
- [Per-manifest presentation guidance; May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509374914510196737)

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

Use the same approach to define ingredient thumbnails. This example supplies a
thumbnail explicitly; it does not demonstrate automatic thumbnail generation.

Source: [custom thumbnails and relative paths, August 31, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1543975786468352150)

### How can I sign a TIFF sample and configure created assertions?

C2PA Tool supports reading and writing TIFF files. For example:

```sh
c2patool sample.tiff \
  --settings settings.toml \
  --manifest manifest.json \
  --output signed.tiff
```

With this command, the source asset becomes a `parentOf`
ingredient and the tool automatically adds the `c2pa.opened` action.
You can omit `--settings` when using the default key and certificate. Those
defaults do not establish production trust or product conformance.

To mark assertions as created rather than gathered, configure
`builder.created_assertion_labels` in the settings file. For example:

```toml
[builder]

created_assertion_labels = [
  "c2pa.actions",
  "c2pa.ingredient"
]
```

Select assertion labels appropriate to your implementation; this example is
not a universal conformance configuration.

Sources:

- [TIFF signing command and defaults; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549488757898616973)
- [Created assertion settings; September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549489530598588417)

### Why does C2PA Tool behave differently when launched by my application versus on the command-line?

Check the executable path and version your application launches,
rather than only the version available in your terminal.

In the reported case, the application launched C2PA Tool 0.26.1,
although the user expected 0.26.41. Launching 0.26.41 resolved the
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
