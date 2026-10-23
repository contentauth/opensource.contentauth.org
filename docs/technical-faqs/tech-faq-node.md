# Node.js SDK FAQs

These answers are based on the 29 messages in the exported CAI Node SDK
Discord history, covering April through July 2026. The export supports five
useful questions, not ten independent answered topics. Questions are selected
for actionable guidance rather than a measured frequency ranking.

Version-specific information reflects those discussions and has not been
independently checked against the latest release. Discord source links may
require channel access.

## How do I configure created versus gathered assertions?

Use `builder.created_assertion_labels` to identify the assertions attributed
to your claim generator. The April support reply provided this example:

```js
const settings = {
  builder: {
    created_assertion_labels: [
      "c2pa.actions",
      "c2pa.thumbnail.claim",
      "c2pa.thumbnail.ingredient",
      "c2pa.ingredient"
    ]
  }
};
```

Choose labels that reflect your implementation; this is not a universal
conformance configuration. The reply explains that assertions were gathered
by default, except for the hard binding, which is always created.

Use only **base assertion labels**, without version or instance suffixes.
For example, use `c2pa.ingredient`, not `c2pa.ingredient.v3`. The SDK
handles the version.

Support also recommended updating to the latest release of the then-current
Node SDK because an earlier release had a bug. The discussion does not
identify the first release containing that fix. An upgrade does not replace
the need to configure assertion placement.

[Source: assertion settings, April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489395644274839582)

[Source: release guidance, April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489396659451592754)

[Source: base labels, April 2, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1489400012369694912)

## Which Node SDK package should I use instead of c2pa-node 0.5.26?

The July 29 support reply identifies `c2pa-node` 0.5.26 as the final
release of the deprecated v1 Node SDK. It recommends migrating to
[`@contentauth/c2pa-node`](https://www.npmjs.com/package/@contentauth/c2pa-node),
which was at version 0.8.0 at the time.

The replacement package is maintained in the
[`contentauth/c2pa-js` monorepo](https://github.com/contentauth/c2pa-js).
Do not treat 0.8.0 as a recommendation to pin that historical version today.

The user who asked about trust-list configuration confirmed that migrating
to 0.8.0 enabled the trust settings shown in the next answer.

[Source: package migration, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532213791943692398)

[Source: repository location, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532213910495563867)

[Source: successful migration, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

## How do I configure signing-certificate and timestamp trust?

The July support example loads the C2PA Trust List and C2PA TSA Trust List,
combines their PEM contents, and enables both trust checks. With those PEM
strings already loaded as `c2paTrustList` and `c2paTsaTrustList`, pass the
settings to both the reader and builder:

```js
const settings = {
  trust: {
    trust_anchors: c2paTrustList + c2paTsaTrustList,
  },
  verify: {
    verify_trust: true,
    verify_timestamp_trust: true,
  },
};

const reader = await Reader.fromAsset({ path: "photo.jpg" }, settings);
const builder = Builder.withJson({ title: "photo.jpg" }, settings);
```

This is a configuration excerpt, not a complete program: it assumes the
reader and builder bindings are imported and the PEM contents have been
fetched or read. It comes from the replacement package discussed above,
not the deprecated `c2pa-node` 0.5.26 API.

[Source: reader and builder trust settings, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)

[Source: user confirmation, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

## Should I pass a PEM file path or its contents as trust anchors?

Pass the **PEM contents as a string**. In the April troubleshooting
discussion, support advised replacing a file path with the actual PEM
data. After inspecting the code, support identified C2PA Tool's
`load_trust_resource()` as a convenience for loading PEM data from a path
or URL; that behavior should not be assumed for the Node SDK.

The `loadSettingsFromFile()` function mentioned in that discussion loads
the whole settings file. It is not evidence that an individual trust-anchor
setting accepts a PEM path.

The later July example also supplies PEM strings through
`trust.trust_anchors`. The April thread does not include a confirmed
resolution for the particular Adobe-signed asset being tested, so do not
assume that changing the input format resolves every trust failure.

[Source: PEM contents, April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490086610321145876)

[Source: settings-file distinction, April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490087412364218409)

[Source: C2PA Tool convenience method, April 4, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1490090813227536416)

[Source: later PEM-string example, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532214117342122025)

## Does a Valid validation state mean that the signer is trusted?

No. The July support reply distinguishes three manifest states:
**well-formed**, **valid**, and **trusted**. Trusted manifests are also
valid, and valid manifests are also well-formed. The reverse does not follow.

A user testing the replacement SDK with trust verification enabled reported
a `Valid` state for a test certificate while
`validation_results.activeManifest.failure` contained
`signingCredential.untrusted`. Support confirmed that the report's overall
state follows the manifest-state model.

Do not label a manifest trusted merely because its state is `Valid`.
Inspect the trust-related validation results, and distinguish trust that
was not evaluated from a failed trust check. An issuer name alone does
not establish trust.

See the source-linked
[manifest states specification](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_manifest_states).

[Source: valid-but-untrusted result, July 29, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532235743022288977)

[Source: state hierarchy, July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378030276612178)

[Source: specification reference, July 30, 2026](https://discord.com/channels/983153151341371422/1168635192680923206/1532378218420633610)
