# C2PA Tool FAQs

These answers are based on the 69 messages in the exported CAI C2PA Tool
Discord history, covering April 1 through October 8, 2026. The export supports
eight useful answered topics, selected for actionable guidance rather than
a measured frequency ranking.

Behavior and version information reflect those discussions and have not been
independently checked against the latest releases or external sources.
Discord source links may require server membership and channel access.

Selected answers also draw on the General channel history from April through
October 2026, with the same source-only, unverified status.

## How can I inspect a file locally from the command line?

The September 11 General-channel answer recommends the open-source C2PA
Tool CLI for inspecting a file on your own machine:

```sh
c2patool file.jpg --detailed
```

This avoids uploading the asset to a web inspection service. It is not a
promise that every configuration or operation is network-free; for example,
the trust initialization command below fetches trust lists. Local
inspection also does not by itself establish that the signer is trusted
or that the depicted content is true.

[Source: local CLI inspection command, September 11, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1548138360139419719)

## Does C2PA Tool load trust lists automatically?

The answer changed during the exported period. In April 2026, support said
the C2PA Trust List was not loaded automatically and showed how to supply
trust anchors through settings or the command line.

On June 19, support announced a command to fetch or update trust lists and
store them for future calls:

```sh
c2patool init trust
```

The announcement says trust sidecars are loaded automatically on subsequent
runs from the same directory as the settings file. This describes behavior
after initialization, not an assurance that an unconfigured installation
already has current trust lists.

For ingredient validation during signing, the May guidance specifically
called for configuring both the C2PA Trust List and C2PA TSA Trust List.

[Source: explicit trust configuration, April 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1488985307343884348)

[Source: trust initialization, June 19, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1517556047324250223)

[Source: ingredient and timestamp trust, May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509239917262405742)

## Does a new manifest automatically inherit its parent's title?

In the April discussion, support said there was no automatic assignment of
the `parentOf` ingredient's title to the new claim's `dc:title`. Without an
explicit title in the manifest definition, the output filename was used.

Set the desired title in the new manifest definition rather than relying on
inheritance. The follow-up confirmed that supplying the title this way
worked. This sets the active manifest's title; changing an ingredient's
title is a separate operation.

[Source: default title behavior, April 7, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1491244347075727431)

[Source: explicit title confirmation, April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499462978687209482)

## How can I override an ingredient's title?

The April support answer describes exporting a signed asset as an ingredient
using the `--ingredient` option. The resulting folder contains ingredient
JSON, a thumbnail, and the manifest binary. Edit the title in the ingredient
JSON, then reference the folder through `ingredient_paths` in the new
manifest definition:

```json
"ingredient_paths": ["./ingredient-folder"]
```

This is a field excerpt, not a complete JSON document. The follow-up
confirmed that this workflow worked.

[Source: ingredient export and title workflow, April 30, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499513543291305995)

[Source: successful result, May 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1499846501948456980)

## Does the overall validation state describe only the active manifest?

No. In the May discussion, support clarified that `validation_state` also
considers ingredient deltas. An earlier suggestion that an ingredient
failure should not affect the overall state was superseded by this
explanation after inspecting the code.

For the active manifest alone, inspect the success, informational, and
failure arrays in `validation_results.activeManifest`. Do not interpret
an aggregate `Invalid` result as proof that the active manifest itself
has a signature failure.

Support recommended displaying each manifest's state independently and
distinguishing valid-but-untrusted manifests from trusted ones. That is
presentation guidance, not a rule that cryptographic validity establishes
signer trust.

[Source: aggregate state clarification, May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509250331320778864)

[Source: active-manifest results, May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555410921590835)

[Source: ingredient deltas, May 28, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509555776585465907)

[Source: per-manifest presentation guidance, May 27, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1509374914510196737)

## How do I supply my own thumbnail?

The August support answer shows a `thumbnail` object in the manifest
definition. Its `identifier` is a file path relative to the manifest
definition file:

```json
"thumbnail": {
  "format": "image/jpeg",
  "identifier": "thumbnail.jpg"
}
```

This is a field excerpt to include in a complete manifest definition.
The source command was:

```sh
c2patool sample.mp4 -m manifest.json -o sample-signed.mp4
```

Support said the same approach can define ingredient thumbnails. This
provides an explicit thumbnail; it does not explain or promise automatic
thumbnail generation for every input format.

[Source: custom thumbnails and relative paths, August 31, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1543975786468352150)

## Why might an HEIC thumbnail not appear in Verify?

The September answer separates signing from display. For the reported
thumbnail format being changed to `application/octet-stream`, support
advised using a v2 claim, either by setting `claim_version` to `2` or by
omitting it when v2 was the default. The follow-up confirmed that this
resolved the reported signing issue.

Display also depends on browser support. At the time, support reported
that `image/heic` thumbnails displayed in macOS Safari but not Chrome.
A correctly embedded thumbnail therefore did not guarantee display in
every browser. These observations are historical, not a current browser
compatibility matrix.

[Source: v2 claims and browser-dependent display, September 1, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544362081107578961)

[Source: successful result, September 2, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1544907804417064970)

## How can I sign a TIFF sample and configure created assertions?

The September support reply confirmed TIFF reading and writing and supplied
this example:

```sh
c2patool sample.tiff \
  --settings settings.toml \
  --manifest manifest.json \
  --output signed.tiff
```

For that command, support said the source asset becomes a `parentOf`
ingredient and the tool automatically adds the `c2pa.opened` action.
The reply also allowed omitting settings when using the default key and
certificate; it did not establish that those defaults are trusted or
qualify a product for conformance.

When the implementation needs to designate created rather than gathered
assertions, the follow-up supplied this settings excerpt:

```toml
[builder]

created_assertion_labels = [
  "c2pa.actions",
  "c2pa.ingredient"
]
```

Select the assertions appropriate to the implementation. This is a signing
example, not a complete conformance procedure or universal configuration.

[Source: TIFF signing command and defaults, September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549488757898616973)

[Source: created assertion settings, September 15, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1549489530598588417)

## Where is the C2PA Tool source repository?

The September 10 announcement says the CLI source moved out of `c2pa-rs`
into the separate
[`contentauth/c2patool` repository](https://github.com/contentauth/c2patool).
The stated purpose was to allow CLI changes without versioning the Rust
SDK and to avoid confusion between their version numbers.

The announcement explicitly said this move did not change how to install
or use the tool.

[Source: repository move, September 10, 2026](https://discord.com/channels/983153151341371422/983153390781616159/1547708360432812152)
