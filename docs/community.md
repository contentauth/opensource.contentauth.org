---
id: community-resources
title: Community resources
---

The Content Authenticity Initiative has an active and growing community of developers collaborating on the ecosystem of open-source tools and libraries for working with digital content provenance creation and validation.

## GitHub

All the open-source CAI code is hosted in GitHub in the [CAI GitHub organization](https://github.com/contentauth):

- **Rust Library**: [c2pa-rs](https://github.com/contentauth/c2pa-rs)
- **CLI tool**: [c2patool](https://github.com/contentauth/c2patool)
- **JavaScript library**: [c2pa-web](https://github.com/contentauth/c2pa-web)
- **Python library**: [c2pa-python](https://github.com/contentauth/c2pa-python)
- **Node.js library**: [c2pa-node](https://github.com/contentauth/c2pa-node-v2)
- **C++ library**: [c2pa-c](https://github.com/contentauth/c2pa-c)

If you think you've found a bug or want to request a feature, please open an issue in the appropriate repository.

:::note
Do not create a public GitHub issue for **suspected security vulnerabilities**. Instead, please file an issue through [Adobe's HackerOne page](https://hackerone.com/adobe?type=team). 
For more information on reporting security issues, see [SECURITY.md](https://github.com/contentauth/c2pa-rs/blob/main/SECURITY.md).
:::

We also welcome thoughtful pull requests (PRs) from the community, following the contribution guidelines provided out in each repository. The guidelines are generally the same for all the SDK repositories; for example. see the [c2pa-rs contribution guidelines](https://github.com/contentauth/c2pa-rs/blob/main/CONTRIBUTING.md).

Participants are required to follow the [Adobe Code of Conduct](https://github.com/contentauth/c2pa-rs/blob/main/CODE_OF_CONDUCT.md) to maintain an open and welcoming environment for all.

### Verify

The code for the [C2PA Verify website](https://verify.contentauthenticity.org/) is open source.  For general information on using it, see [Using the Verify tool](verify.mdx).

### Related projects

These related projects may be of interest, but the CAI team doesn't maintain or support them:

- [**Drupal module**](https://github.com/contentauth/c2pa-drupal): Enables Drupal sites to process and display Content Credentials for supported image types.
- [**DASH video player**](https://github.com/contentauth/dash.js/tree/c2pa-dash):  DASH video player that displays Content Credentials in browsers for supported media types. This repo/branch is a work-in-progress forked from [dash.js](https://github.com/Dash-Industry-Forum/dash.js), the canonical reference JavaScript implementation for the playback of MPEG DASH. 
- [**TrustMark**](https://github.com/adobe/trustmark): Open-source Python implementation of watermarking for encoding, decoding and removing image watermarks. You can use TrustMark as part of providing [durable content credentials](durable-cr/index.md).
- [**C2PA Security Testing Tool**](https://github.com/contentauth/c2pa-attacks): A CLI tool derived from [c2patool](https://github.com/contentauth/c2patool) that performs security testing on a Content Credentials application.  This tool is intended for use by software security professionals.

## Browser extension

The free [browser extension for Google Chrome](https://chromewebstore.google.com/detail/c2pa-content-credentials/mjkaocdlpjmphfkjndocehcdhbigaafp?hl=en) enables you to verify and display manifests for images, audio and videos which have C2PA Content Credentials.

## C2PA Foundations video course

For a series of educational videos, see [C2PA Foundations: A Course for Implementers](http://learn.contentauthenticity.org/).

## Discussions on Discord

The CAI maintains a [Discord server](https://discord.gg/CAI) for open technical discussions within the developer community, with channels focused on different projects and topics.

## Other resources

- **Read the [CAI blog](https://contentauthenticity.org/blog)** to get the latest news and updates about CAI.
- **Follow [CAI on Twitter](https://twitter.com/ContentAuth)** for the latest general announcements and information.
- **[The FAQ](./faqs)** address a number of high-level questions.

## Developer survey

Please take the [**developer survey**](https://forms.office.com/Pages/DesignPageV2.aspx?subpage=design&id=Wht7-jR7h0OUrtLBeN7O4RWoZMBioAJJorRXmx4di3tUMFg5QlJGNENJQkQ5UjhNQjM5MDE3UEFGTi4u&analysis=true&tab=0&topview=SurveyResults&qid=rc8dcb08d558743b1bbb6495c84c4bb76&ridx=0) to help us better understand how we can improve the CAI open source SDK. It only takes about 5-10 minutes. Your response is anonymous unless you provide your details in the form.
