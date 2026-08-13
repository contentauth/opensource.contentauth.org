---
id: cawg-mobile
title: CAWG on Mobile
---

# Adding Creator Assertions (CAWG) on Mobile

This tutorial is a high-level guide with sample code for implementing the [Creator Assertions Working Group (CAWG)](https://cawg.io/) specifications using the [C2PA SDK for Android](https://github.com/contentauth/c2pa-android).

A plain C2PA manifest answers "what device or app produced this file, and what happened to it?". Creator Assertions answer a different question: "who is the person or organization behind it, and what do they permit?". It achieves this with a second signing identity. The C2PA claim is signed by the capturing app or device; the CAWG identity assertion is signed by a credential belonging to the creator. Both signatures end up in the same manifest, and a validating verifier can check them independently.

This guide covers three CAWG features and how they fit together:

* [Identity](https://cawg.io/identity/1.1/) (`cawg.identity`): Who the identity of the signer is, and which assertions they vouch for
* [Metadata](https://cawg.io/metadata/1.2-draft/) (`cawg.metadata`): Creator name, copyright, and other standard metadata
* [Training and data mining](https://cawg.io/training-and-data-mining/1.1/) (`cawg.training-mining`): Whether the asset may be used for AI training or data mining

The latest specifications are always on the [CAWG specs page](https://cawg.io/specs/).

In addition, the focus of this tutorial is on [CAWG signing using X.509 certificates](https://opensource.contentauthenticity.org/docs/manifest/reading/reading-cawg-id/), and NOT using [Identity Claims Aggregation](https://cawg.io/about/identity-framework/) through W3C Verifiable Credentials. We expect to provide more guidance and support on the second approach in the near future. 

## Before you start

**SDK version.** CAWG support requires **c2pa-android 0.0.10 or later**. Earlier releases do not include `Signer.withCawgIdentity`.

```toml
# gradle/libs.versions.toml
[versions]
c2pa = "0.0.10"

[libraries]
c2pa = { module = "org.contentauth:c2pa", version.ref = "c2pa" }
```

**Reference implementation.** Every snippet below is taken from working code in the [Proofmode for Android](https://github.com/guardianproject/proofmode-android/tree/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa) codebase, primarily:

- [`C2PAManager.kt`](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt): assertions, signer setup, and signing
- [`selfsign/CAWGIdentityManager.kt`](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/selfsign/CAWGIdentityManager.kt): key, certificate, and CSR generation

**What you already need working.** This guide assumes you can already produce a signed C2PA manifest with the C2PA Android SDK (a `Signer`, a manifest definition, and a successful `Builder.sign()` call). CAWG is layered on top of that, not a replacement for it.

---

## Step 1: Create or import a CAWG signing identity

The identity assertion is signed with a credential that represents a creator of some kind, possibly ranging from artist to producer, individual or organization. This credential is separate from the key that signs the C2PA claim. For CAWG signing, you need a private key and a matching X.509 certificate chain, both in "PEM" (short for Privacy Enhanced Mail, but no one calls it that) form. 

CAWG support in this SDK has been tested with **256-bit elliptic curve keys on the NIST P-256 curve** (`secp256r1`), signed using ECDSA with SHA-256 — `SigningAlgorithm.ES256`.

> **Please note:** The identity signer in this sample is built with `Signer.fromKeys()` and needs the private key as a PEM string. It is not using hardware-backed keys, whose private material can never leave the secure element. It is possible to generate a hardware-backed key stored in a secure element, or even implement a Remote Signer with a key on a server, and use it with CAWG. We will leave that more advanced implementation as an exercise for the reader. The C2PA-Android samples and SDK projects contain a variety of code samples on how to do this.

### Generating a new identity

`createCawgKey()` generates the key pair, writes the private key PEM to `<alias>.key`, generates a PKCS#10 certificate signing request into `<alias>.csr`, and stores a certificate chain in `<alias>.cert`.

```kotlin
val keyAlias = "CAWG_SECURE_1"

val fileKey = File(context.filesDir, "$keyAlias.key")
val fileCert = File(context.filesDir, "$keyAlias.cert")

// Generate the key, CSR, and certificate on first run only.
if (!fileKey.exists()) {
    Timber.d("Creating new CAWG identity key")
    val country = Locale.getDefault().country
    CAWGIdentityManager(context).createCawgKey(
        keyAlias = keyAlias,
        useHardware = false,   // identity signing needs an exportable key
        creatorName = creatorName,
        country = country,
    )
}

//the local files will now exist based on the keyAlias name above
val privateKey = fileKey.readText()
val certChain = fileCert.readText()
```

The certificate that is created with a freshly generated identity is self-signed. This is useful for development, but it will not chain to a public trust list, so verifiers will show the identity as untrusted. To get a credential that validates for other people, submit the generated CSR to a certificate authority that issues CAWG identity certificates, such as [SSL.com](https://www.ssl.com/products/content-authenticity/content-credentials/cawg/) or [Trufo](https://trufo.ai/products/certificates#cawg). Both offer individual- and organization-verified options. Any Certificate Authority on the [Mozilla Trust List](https://wiki.mozilla.org/CA/Included_Certificates) should be trusted for CAWG signatures.

Proofmode provides the CSR to the user through `getCawgCSR()`, so it can be copied out and sent to a CA. When the CA returns a signed certificate, or when a creator already holds a credential, swap it in by overwriting the two PEM files and discarding the now-stale CSR:

```kotlin
fun importCawgIdentity(privateKeyPem: String, certChainPem: String) {
    File(context.filesDir, "$CAWG_KEY_ALIAS.key").writeText(privateKeyPem)
    File(context.filesDir, "$CAWG_KEY_ALIAS.cert").writeText(certChainPem)
    // The old CSR belongs to a key the user no longer holds.
    File(context.filesDir, "$CAWG_KEY_ALIAS.csr").delete()
}
```

### Building the identity signer

Once you hold both PEMs, the identity signer is an ordinary `Signer`. Note the argument order — **certificate chain first, then private key**:

```kotlin
val identitySigner = Signer.fromKeys(
    certChain,                 // certsPEM
    privateKey,                // privateKeyPEM
    SigningAlgorithm.ES256,
)
```

Hold on to this identitySigner instance, you will need it later!

---

## Step 2: Add the CAWG metadata assertion

The [CAWG metadata assertion](https://cawg.io/metadata/1.2-draft/) carries descriptive metadata about the asset. The specification deliberately places no restriction on which fields you may include, so it works by embedding existing metadata vocabularies. The example below uses [Dublin Core](https://www.dublincore.org/specifications/) (`dc`) and [Exif](https://en.wikipedia.org/wiki/Exif).

You declare the vocabularies you use in an `@context` block, then add key/value pairs using those prefixes.

```kotlin
// The values the creator configured
val cawgCreator = "Nathan Freitas"
val cawgRights = "© 2026 Nathan Freitas. All Rights Reserved."

// Declare the metadata vocabularies being used
val cawgContext = hashMapOf(
    "dc" to "http://purl.org/dc/elements/1.1/",
    "exif" to "http://ns.adobe.com/exif/1.0/",
)

// The metadata itself, keyed by vocabulary prefix
val cawgInfo = HashMap<String, String>()
if (cawgCreator.isNotEmpty()) {
    cawgInfo["dc:creator"] = "[$cawgCreator]"
    cawgInfo["Exif.Image.Artist"] = cawgCreator
}
if (cawgRights.isNotEmpty()) {
    cawgInfo["dc:rights"] = cawgRights
    cawgInfo["Exif.Image.Copyright"] = cawgRights
}

// Turn it into an assertion and add it to the manifest's assertion list
listAssertions.add(createCAWGMetadataAssertion(context, cawgContext, cawgInfo))
```

`createCAWGMetadataAssertion()` is a thin helper that wraps the two maps into an `AssertionDefinition`:

```kotlin
private fun createCAWGMetadataAssertion(
    context: Context,
    cawgContext: HashMap<String, String>,
    cawgInfo: HashMap<String, String>,
): AssertionDefinition = AssertionDefinition.custom(
    label = "cawg.metadata",
    data = buildJsonObject {
        put("@context", buildJsonObject {
            for ((prefix, uri) in cawgContext) put(prefix, uri)
        })
        for ((key, value) in cawgInfo) put(key, value)
    },
)
```

See the [full helper in Proofmode](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt#L1254).

---

## Step 3: Add the training and data mining assertion

The [CAWG training and data mining assertion](https://cawg.io/training-and-data-mining/1.1/) records the creator's preferences about AI and data-mining use of the asset. It is an `entries` **map**, keyed by use category, where each value carries a `use` permission.

The specification defines four categories and three permission values:

| Category | Covers |
| --- | --- |
| `cawg.data_mining` | Data mining generally |
| `cawg.ai_inference` | Inference using an already-trained model |
| `cawg.ai_training` | Training a model of any kind |
| `cawg.ai_generative_training` | Training a *generative* AI model |

Permitted values are `"allowed"`, `"notAllowed"`, and `"constrained"`. Use `constrained` together with a `constraint_info` string that explains the terms; the specification advises that a verifier lacking further information should treat `constrained` as equivalent to `notAllowed`.

```kotlin
// Map each use category to a permission value.
val trainingMiningEntries = linkedMapOf(
    "cawg.data_mining" to "allowed",              // allow general data mining
    "cawg.ai_generative_training" to "notAllowed", // no generative model training
    "cawg.ai_training" to "notAllowed",            // no model training at all
    "cawg.ai_inference" to "allowed",              // inference on trained models is fine
)

val trainingMining = AssertionDefinition.custom(
    label = "cawg.training-mining",
    data = buildJsonObject {
        put("entries", buildJsonObject {
            for ((category, use) in trainingMiningEntries) {
                put(category, buildJsonObject { put("use", use) })
            }
        })
    },
)

listAssertions.add(trainingMining)
```

---

## Step 4: Combine the C2PA and identity signers

This is where CAWG joins the main signing flow. `Signer.withCawgIdentity()` takes your existing C2PA claim signer plus the identity signer from Step 1 and returns a single combined signer that emits the `cawg.identity` assertion alongside the C2PA claim signature.

```kotlin
// The role this actor played. See the named actor roles below.
val listRoles = listOf("cawg.creator")

val combinedSigner = Signer.withCawgIdentity(
    c2pa = c2paSigner,          // your existing claim signer (keystore, StrongBox, remote…)
    identity = identitySigner,  // from Step 1
    referencedAssertions = listOf("c2pa.actions", "cawg.training-mining", "cawg.metadata"),
    roles = listRoles,
)
```

**`referencedAssertions`** is the list of manifest assertion labels that the creator's signature vouches for. It is what turns the identity assertion from "this person exists" into "this person stands behind these specific claims". The identity specification requires the manifest's hard binding assertion to be covered as well; read back the signed manifest (Step 6) to confirm the final list is what you expect.

**`roles`** describes what the actor did. The [identity specification](https://cawg.io/identity/1.1/) defines seven named actor roles:

`cawg.creator` · `cawg.contributor` · `cawg.editor` · `cawg.producer` · `cawg.publisher` · `cawg.sponsor` · `cawg.translator`

For a photo captured in-app, `cawg.creator` is almost always the right choice. Custom values are permitted if they follow the namespace conventions.

> ### Things to look out for
>
> - **Never cache and reuse a signer** across sign operations when CAWG is enabled. The second call throws `c2pa signer is already closed`. Create a fresh signer for each file you sign.
> - The two signers must be **distinct instances**; passing the same one twice throws `C2PAError.Api`.
> - Do not call `withCawgIdentity()` concurrently with `close()` on the same signer; it reads the input pointers without synchronization.

---

## Step 5: Configure the builder and sign

With the assertions built and the signers combined, the remaining work is ordinary C2PA signing.

### Settings: created vs. gathered assertions

C2PA distinguishes assertions the claim generator *created* itself from those it merely *gathered*. The SDK decides which bucket an assertion lands in by comparing its label against `builder.created_assertion_labels`. `Builder.DEFAULT_CREATED_ASSERTION_LABELS` covers the common ones (`c2pa.actions`, `c2pa.actions.v2`, the thumbnail and ingredient labels); add your own labels to that list for anything your app generates directly.

```kotlin
val createdLabels = Builder.DEFAULT_CREATED_ASSERTION_LABELS + listOf(
    "proofmode.metadata",
    "c2pa.metadata",
)

val settingsJson = buildJsonObject {
    put("version", 1)
    put("builder", buildJsonObject {
        put("created_assertion_labels", buildJsonArray {
            for (label in createdLabels) add(label)
        })
    })
    put("trust", buildJsonObject {
        put("trust_config", trustConfig)   // PEM/config loaded from app assets
    })
}
```

`trustConfig` is a trust configuration the app [ships as an asset](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/assets/trustConfig.txt) and reads at startup; it tells the SDK which certificate authorities to accept when validating. You can also set custom [trust anchors and allowed list](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt#L1071) by bundling the [list of C2PA Trusted Certificate Authorities](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/assets/C2PA-TRUST-LIST-AND-TSA-TRUST-LIST.pem).

### Build and sign

```kotlin
// Apply the settings, then build from the resulting context
val settings = C2PASettings.create().apply {
    updateFromString(settingsJson.toString(), "json")
}
val c2paContext = C2PAContext.fromSettings(settings)
val builder = Builder.fromContext(c2paContext).withDefinition(manifestJSON)
settings.close()

// Record a CREATED action for a fresh camera capture
val softwareAgent = "cawgTest-1.0"
val action = Action(
    PredefinedAction.CREATED,
    DigitalSourceType.DIGITAL_CAPTURE,
    softwareAgent,
    null,
)
builder.addAction(action)
builder.setIntent(BuilderIntent.Create(DigitalSourceType.DIGITAL_CAPTURE))

// Sign from a source stream into a destination stream with the combined signer
builder.sign(
    format = contentType,
    source = sourceStream,
    dest = destStream,
    signer = combinedSigner,
)
```

Remember to close your streams and the combined signer in a `finally` block — see [`signStream()` in Proofmode](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt#L852) for the full pattern, including the guarded close of the already-consumed base signer.

---

## Step 6: Verify the result

**Always read back what you signed** A manifest can be produced successfully and still not contain the identity assertion you expected. A mismatched `referencedAssertions` label or an untrusted certificate will not necessarily fail the signing call.

```kotlin
// Load the trust configuration used for validation
C2PA.loadSettings(settingsJson.toString(), "json")

val manifestJSON = C2PA.readFile(filePath, null)

val validation = ManifestValidator.validateJson(manifestJSON, logWarnings = true)
if (validation.hasErrors()) {
    Timber.d("C2PA validation errors: ${validation.errors.joinToString("; ")}")
}
```

In the returned JSON, confirm that:

* the active manifest contains a `cawg.identity` assertion;
* its `referenced_assertions` lists the labels you passed in Step 4;
* `cawg.metadata` and `cawg.training-mining` are present with the values you set;
* the signature info reports the certificate you expect — not a leftover self-signed development certificate.

For an independent check, inspect the signed file with [c2patool](https://github.com/contentauth/c2pa-rs/tree/main/cli) or upload it to the [Content Credentials verify site](https://contentcredentials.org/verify).

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `c2pa signer is already closed` | A signer was reused after `withCawgIdentity()` consumed it. Create a fresh signer for every sign operation. |
| `C2PAError.Api: c2pa and identity signers must be distinct instances` | The same `Signer` was passed as both `c2pa` and `identity`. |
| `PEM Base64 error: invalid Base64 encoding` | A PEM block whose Base64 body is not wrapped at 64 characters. Regenerate it with `PemWriter`, or re-wrap pasted input. |
| No `cawg.identity` in the manifest | The combined signer was built but the *original* claim signer was passed to `builder.sign()`. Pass the value returned by `withCawgIdentity()`. |
| Identity shows as untrusted in verifiers | The identity certificate is still the self-signed development one. Submit the CSR to a CA and import the issued chain. |
| `referencedAssertions cannot exceed 255 entries` | Both `referencedAssertions` and `roles` are capped at 255 entries. |

---

## Reference

**Specifications**

- [CAWG specifications index](https://cawg.io/specs/)
- [Identity assertion 1.1](https://cawg.io/identity/1.1/) — including [named actor roles](https://cawg.io/identity/1.1/#_named_actor_roles)
- [Metadata assertion 1.2 (draft)](https://cawg.io/metadata/1.2-draft/)
- [Training and data mining assertion 1.1](https://cawg.io/training-and-data-mining/1.1/)

**SDK and sample code**

- [c2pa-android SDK](https://github.com/contentauth/c2pa-android)
- [c2pa-android-example](https://github.com/contentauth/c2pa-android-example) — this repository
- [Proofmode C2PA implementation](https://github.com/guardianproject/proofmode-android/tree/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa) — the reference implementation for this guide

**Certificate authorities issuing CAWG identity certificates**

- [SSL.com](https://www.ssl.com/products/content-authenticity/content-credentials/cawg/)
- [Trufo](https://trufo.ai/products/certificates#cawg)
- [Mozilla Trust List](https://wiki.mozilla.org/CA/Included_Certificates)
