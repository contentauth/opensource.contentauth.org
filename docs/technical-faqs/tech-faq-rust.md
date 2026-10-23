# FAQ: Rust library

These FAQs are based on discussions in the CAI Rust SDK Discord channel from 2026. 
In some cases, the information may be specific to a particular version of the SDK. Always confirm  using the latest release.

Selected answers also draw on the General channel history from April through
October 2026; those additions have not been externally verified.

:::note
Discord source links require a Discord account and joining the public CAI Discord server.
:::

## Can I configure trust anchors using a URL?

The Rust SDK expects trust anchors as a **PEM string**, not a URL or file
path. Your application must fetch or read the PEM data and pass its contents
to the SDK.

C2PA Tool accepts URLs and paths as command-line arguments because it
retrieves the data before passing it to the SDK.

The support reply provided this example:

```rust
let pem = reqwest::blocking::get("https://example.com/trust_anchors.pem")?
    .text()?;

c2pa::settings::Settings::from_toml(
    &toml::toml! {
        [trust]
        trust_anchors = pem
    }
    .to_string(),
)?;
```

[Source: April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491236748653494503)

## How do I mark assertions as created rather than gathered?

Use the `builder.created_assertion_labels` setting to identify assertions
attributed to your claim generator. For example:

```toml
[builder]
created_assertion_labels = [
  "c2pa.actions",
  "c2pa.thumbnail.claim",
  "c2pa.thumbnail.ingredient",
  "c2pa.ingredient"
]
```

Choose labels appropriate to your implementation. This example is not a
universal conformance configuration. The support discussion notes that the
hard-binding assertion is always a created assertion.

See [Created versus gathered assertions](https://opensource.contentauthenticity.org/docs/manifest/writing/assertions-actions/#created-versus-gathered-assertions)
for more information.

[Source: June 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1516521499517779978)

## How do I preserve an existing asset's assertions when editing it?

Include the original asset as a **`parentOf` ingredient**. If the asset is
signed, its manifest and assertions are carried forward through that
ingredient. You generally do not need to copy those assertions into your
new manifest as gathered assertions.

For a typical editing workflow, use:

```rust
builder.set_intent(BuilderIntent::Edit);
```

Edit intent automatically adds the `c2pa.opened` action and uses the source
as the parent if you do not specify one. Do not manually add a duplicate
`c2pa.opened` action.

It is normal for a simple open-and-edit workflow to have no gathered
assertions. If you intentionally reuse metadata as a new gathered assertion,
verify that it still applies to the edited asset.

[Source: parent handling, October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1559968978376593439)

[Source: gathered-assertion clarification, October 14, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1560080821287657594)

An October 15 General-channel troubleshooting reply also recommends edit
intent when an existing asset produces
`assertion.action.malformed: first action must be created or opened`
or `assertion.action.ingredientMismatch`. In that case, the manually defined
`actions` were not nested inside `assertions`, and the workflow also needed
a referenced `parentOf` ingredient. The user confirmed that switching to
edit intent worked. Do not assume an "Invalid Manifest" error is a trust
problem without inspecting its validation details.

[Source: action structure and edit-intent fix, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560317418574839849)

[Source: successful result, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560344798165074072)

## How do I add timestamps for existing ingredient manifests?

Enable automatic timestamp assertions. The support discussion provided
these settings:

```toml
[builder.auto_timestamp_assertion]
enabled = true
fetch_scope = "all"
```

Choose the builder intent according to the operation:

- Use **update intent** when the asset content has not changed and you only
  need to add a timestamp assertion.
- Use **edit intent** when you are also editing or reformatting the asset.

The support responder tested both approaches. The discussion also states
that the timestamp assertion must be added while the relevant signing
certificate is still within its validity period.

[Source: settings, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495826791313571900)

[Source: intent selection, April 20, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495827650026147952)

[Source: certificate validity, April 7, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1491238678410821784)

## Why is no thumbnail generated when thumbnails are enabled?

The SDK skips automatic thumbnail generation for **update manifests**,
even when thumbnail generation is enabled. The support reply explains that
the specification does not permit update manifests to contain thumbnail
assertions.

[Source: April 19, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1495464171934974002)

## Why do I get duplicate timestamp assertions with `skip_existing = true`?

The intended behavior of `skip_existing` is to exclude claims already
covered by timestamps, including timestamps in COSE signatures and timestamp
assertions.

The discussion identified a bug when an ingredient contained **both**
forms of timestamp. The fix was submitted in
[PR #2085](https://github.com/contentauth/c2pa-rs/pull/2085), and the support
responder confirmed that it merged on April 24, 2026.

If you encounter this behavior, check whether your SDK version includes
that fix. The discussion does not identify the first release containing it.

[Source: diagnosis, April 24, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1497281494471806976)

[Source: merge confirmation, April 24, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1497360349878419509)

## Why does C2PA Tool behave differently when launched by my application?

Check the **actual executable and version** your application launches,
rather than only the version available in your terminal.

In the reported case, the application launched C2PA Tool **0.26.1**,
although the user expected **0.26.41**. Launching 0.26.41 resolved the
missing timestamp assertion.

This is one troubleshooting step, not evidence that every missing timestamp
has this cause.

[Source: confirmed resolution, April 22, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1496644840786624614)

## Can I create sidecar manifests for unsupported file types?

Yes. In the September 2026 discussion, support confirmed that sidecar
support for otherwise unsupported file types had been implemented,
referenced [PR #2014](https://github.com/contentauth/c2pa-rs/pull/2014),
and tested `.obj` and `.mtl` files.

A user running C2PA Tool 0.27.22 saw an "unsupported file type" error
**after signing**, during the subsequent read operation. The sidecar had
still been created.

To read the asset with its sidecar, the support reply recommended:

```sh
c2patool file.obj --external-manifest file.c2pa
```

The user subsequently confirmed that the sidecars were being written
successfully.

[Source: implementation, September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549892485080293416)

[Source: read command, September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549898982988455988)

[Source: user confirmation, September 17, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1550145681090412695)

## How do I avoid sidecar filename collisions?

Assets with the same base name can produce the same default sidecar
filename. For example, `file.obj` and `file.mtl` can both produce
`file.c2pa`.

Rename each sidecar immediately after creating it to preserve the original
extension, for example:

```text
file.obj.c2pa
file.mtl.c2pa
```

When reading an asset, explicitly provide the corresponding sidecar using
`--external-manifest`.

[Source: September 16, 2026](https://discord.com/channels/983153151341371422/983153550018371595/1549894561537466399)

## Why does manifest compression barely reduce a long existing chain?

The October 15 support reply explains that compression applies to the
current manifest being written, not retroactively to every manifest in an
existing chain. To compare compressed and uncompressed chains, enable
`prefer_compress_manifests` while writing each generation.

Support tested ten manifests containing a repetitive text custom assertion.
The final manifest-store size was 154,638 bytes without compression and
52,583 bytes with compression enabled at each generation. The responder
explicitly cautioned that repetitive test data would likely compress better
than real-world content. This is not a promised compression ratio or a way
to shrink all prior manifests by appending one compressed manifest.

[Source: compression scope and test recommendation, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560358414264172585)

[Source: controlled comparison and data caveat, October 15, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1560370962875285566)

## Can I use the Rust implementation from a JVM backend?

The September 14 reply points to the Rust implementation's
[C API](https://github.com/contentauth/c2pa-rs/tree/main/c2pa_c_ffi) as an
integration route through JNI.

The responder said a Kotlin library had been discussed, but development
had focused on Android-specific needs. Forking the Android bindings for a
JVM service was suggested as possible work, not offered as an existing,
maintained JVM package. The export does not establish a supported Java
binding or provide a complete JNI integration example.

[Source: Android scope and C API integration route, September 14, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1549054456258240674)
