# General FAQs

These answers are based only on the 287 messages in the exported CAI General
Discord channel history, covering April 1 through October 21, 2026. They
have not been independently verified against external sources or current
releases. Dated implementation guidance and linked resources reflect those
discussions, not guarantees of current availability or compatibility.
Discord source links may require server membership and channel access.

## Where can I find signed sample assets, including location and time examples?

The April replies point to Proofmode's public
[Baseline repository](https://proofmode.org/baseline/), while warning that
much of its content used older C2PA 1.x support. Another reply suggests the
[`contentauth/example-assets` repository](https://github.com/contentauth/example-assets)
as a place to submit signed assets for testing. Neither answer promises a
complete, current conformance test suite.

For location metadata, the Proofmode developer links the
[Android 3.0.2 release candidate](https://github.com/guardianproject/proofmode-android/releases/tag/3.0.2-RC-2)
and its use of `c2pa.metadata` to include geolocation as a created assertion.
Older conformance samples used `stds.exif`, described as deprecated but
still valid. A follow-up links the
[Kotlin metadata-generation code](https://github.com/guardianproject/proofmode-android/blob/main/android-libproofmode/src/main/java/org/witness/proofmode/c2pa/C2PAManager.kt#L840).

These are source-provided examples and implementation pointers, not a
guarantee that every sample contains GPS and a timestamp, that their
certificates remain trusted, or that signed metadata proves the truth of
the depicted event.

[Source: Baseline and older sample versions, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489689553886384228)

[Source: Android geolocation implementation, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489689681653141634)

[Source: older sample assertion format, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489690080623726795)

[Source: metadata-generation code, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489690402805125372)

[Source: shared signed-asset repository, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489693250133430272)

## How can I get started with Content Credentials on Android or iOS?

For users, the April 4 support reply recommends installing a C2PA-enabled
camera app, giving Proofmode as an iOS example. This is app-based guidance,
not a statement that the built-in camera on every iPhone signs assets.

For developers, the April and May replies recommend the open-source
[mobile SDKs](https://opensource.contentauthenticity.org/docs/mobile)
for Android and iOS rather than maintaining a new C2PA implementation.
SDK availability is distinct from the conformance or trust status of an
application built with it.

[Source: iOS camera-app route, April 4, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1490063556698443877)

[Source: Android library recommendation, April 3, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1489689175270625582)

[Source: Android and iOS SDK resources, May 14, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1504547100493348884)

## Can a manifest carry custom sensor or verification information?

Yes. In response to a proposed sensor-noise extension, the April 20 answer
confirms that custom assertions can be added to a C2PA manifest. A validator
that understands that assertion could use its information to identify where
changes occurred.

That is an extensibility mechanism, not endorsement of the proposal's
claimed security guarantees or a promise that existing validators understand
it. The follow-up about coordinating camera and editor implementations
was not resolved in the exported discussion.

[Source: custom assertions and validator support, April 20, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1495831402938110155)

## Where are embedding rules for TIFF-based and base-media file formats documented?

The August 17 reply directs implementers to the **Embedded Formats annex**
of the
[Content Credentials specification](https://c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html).
It was answering a question about TIFF-based Sony formats and the
base-media-based Canon CR3 format.

This is a specification pointer, not confirmation that every raw camera
format is supported by a particular SDK. The reply did not supply the
requested camera samples.

[Source: Embedded Formats annex, August 17, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1538922552007589898)

## Where can I report a CAI security concern?

The October 19 support reply recommends the
[CAI contact form](https://contentauthenticity.org/contact) for something
that needs reporting. In the follow-up, support said the specific report
had been routed onward, but that the responder might not know its status.

The discussion does not establish a dedicated security inbox, a response
deadline, or a promise of public status updates.

[Source: reporting contact, October 19, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1561895003670716528)

[Source: routing and status limitations, October 19, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1561895701028536405)
