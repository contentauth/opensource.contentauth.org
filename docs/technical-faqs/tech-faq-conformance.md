---
hide_table_of_contents: true
---

import TOCInline from '@theme/TOCInline';

# C2PA conformance FAQs

<TOCInline toc={toc} />

### How do I start the conformance process?

Start with the [expression of interest form](https://docs.google.com/forms/d/e/1FAIpQLScERZH5rKfoeSu3y6gGbkllkyeAhmF0G-kXS0eXpb2vR238Rg/viewform?usp=header).

Use test certificates while preparing for evaluation. A generator product must pass conformance before it can obtain a production signing certificate from a CA on the C2PA Trust List.  

For more information and a detailed example walkthrough of the application process, see the [Implementer's guide to conformance](../conformance/conformance-guide.mdx).

### How do I modify an application to the program?

Contact the conformance administrator at conformance@c2pa.org for any issues with your 
application to the C2PA Conformance Program. If you've submitted an expression of
interest form but not received a timely response, provide the representative email address used in the submission. Response times are not guaranteed.

If a generator application incorrectly omits validation capabilities, request
a revision listing both the input media types it validates and the output
media types it generates. For example, a product could validate JPEG and PNG
ingredients while generating signed JPEG, PNG, WebP, and AVIF assets.
List only the capabilities your product supports.

Sources:

- [Application follow-up; July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522236996553146399)
- [Resolution; July 2, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1522288127408865310)
- [Correcting media types; June 21, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1518382298482081872)

### Does conformance apply to the product or to each end user?

Conformance is associated with a generator or validator product, whether
software or hardware, rather than an individual user.

Creator identity is separate from product conformance. To identify users,
include a separately signed CAWG identity assertion. Product conformance
alone does not establish a user's identity.

Source: [Product conformance and identity; August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537131310424784896)

### Does a conformance listing mean the public product already uses production certificates?

Not necessarily. A product can appear on the conforming products list
before public launch. Production certificate deployment can also occur after
listing:
the selected CA must verify conformance and the applicant's legal identity.

Listing alone does not make a beta certificate trusted. Evaluate the
certificate used to sign the asset rather than inferring trust from the
product's listing.

Source: [Listing, launch, and certificate deployment distinction; May 23, 2026](https://discord.com/channels/983153151341371422/986451330992320512/1507727660401295360)

### Why does a generator application ask about validation?

A generator that ingests assets and creates or appends manifests must validate
those assets against the C2PA Trust List and C2PA TSA Trust List. Its declared
validate media types describe those inputs; its generate media types
describe the outputs for which it creates manifests.

This ingredient validation is distinct from applying as a standalone
validator product, which validates assets without generating manifests.
Apply separately as a validator product if you are also building a
verification tool.

Sources:

- [Generator validation scope; July 16, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1527310749628891176)
- [Separate verification tool; August 12, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1537127081672974486)

### How do I choose between backend, distributed, and separate product submissions?

A distributed generator can divide asset generation, assertions, claim
generation, and signing between edge and backend subsystems while functioning
as one product. Use mutual authentication between the subsystems, and
verify on the backend that the caller is a valid instance of
the edge subsystem.

Cooperating subsystems might qualify for a single distributed product submission.
Components that independently generate assets, claims, and signatures are
likely to require separate submissions.

Do not classify a customer-hosted component solely by whether it runs on a
server. Classification requires an assessment of the architecture.
Submit an architecture summary and diagram to conformance@c2pa.org, identifying
the target of evaluation, the components included in the generator
product, and how objects submitted for signing are authenticated.
Also consider how customer-hosted deployments will meet dependency
vulnerability scanning requirements.

Sources:

- [Cooperating subsystems; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810186504671304)
- [Independent generators; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504810688638484660)
- [Distributed authentication; August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542545382997893230)
- [Customer-hosted architecture caveats; August 27, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542586446815170750)
- [Definitive assessment requires an architecture; August 28, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1542842626947154031)

### Does using the latest SDK make my product conformant?

No. The latest SDK provides tools for building a conforming product, but
you must configure and use it correctly. Conformance also covers security
architecture, key management, and other requirements beyond the SDK.
You must submit interoperability test assets as part of the process.

When preparing your implementation:

- Configure created and gathered assertions explicitly.
- Use `c2pa.created` and `c2pa.opened` appropriately. Do not describe an
  existing asset uploaded by a user as newly created by your product.
- Validate ingredients with the C2PA Trust List configured.

Sources:

- [Test assets; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504806955154280601)
- [SDK recommendation and limitation; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807032341925918)
- [Preparation checks; May 15, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1504807213145784443)

### Can evaluation samples use test certificates?

Yes. Evaluation samples can use SDK test certificates, CA-provided test
certificates, or certificates you generate yourself. However, the signing
certificate must not be self-signed.

See the
[SDK test certificates](https://github.com/contentauth/c2pa-rs/tree/main/sdk/tests/fixtures/certs)
and a [certificate creation walkthrough](https://learn.contentauthenticity.org/private-keys-and-certificates).

A `signingCredential.untrusted` result is expected before you obtain a
conforming product certificate. That result alone does not prevent a product
from passing conformance.

Sources:

- [Evaluation certificate constraints; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547716234173222962)
- [Certificate creation walkthrough; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720168149352558)
- [SDK fixtures; September 10, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1547720257018269826)
- [Expected untrusted status; October 9, 2026](https://discord.com/channels/983153151341371422/1403049797023174828/1558172948022698065)

For mixed-pipeline validation behavior, see
[Does adding a trusted manifest remove warnings about earlier untrusted manifests?](./tech-faq-manifests.md#does-adding-a-trusted-manifest-remove-warnings-about-earlier-untrusted-manifests).
