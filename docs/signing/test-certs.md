---
id: test-certs
title: Using test certificates
---

The CAI SDK does not allow you to use a self-signed certificate to sign a manifest.

For initial development and testing, the SDK provides example *test certificates* and private keys:
- The [Rust library `sdk/tests/fixtures/certs/` folder](https://github.com/contentauth/c2pa-rs/tree/main/sdk/tests/fixtures/certs) contains certificates and signing keys for many of the supported [signature types](get-cert.md#signature-types).
- The Node.js, Python, and C++ libraries provide a subset of test certificates in each repository's `tests/fixtures` folder. The Node.js library even provides a [`CreateTestSigner()`](https://github.com/contentauth/c2pa-node/blob/main/docs/README.md#createtestsigner) convenience function to create a local signer instance using the test certificate.

:::warning Warning
While these test credentials are useful during development, you must [get your own certificate](get-cert.md) and use your own private key for production deployment.  
:::

Although not recommended due to complexity and difficulty, you can create your own certificates for development and testing. Follow the requirements in the C2PA Technical Specification [X.509 Certificates](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates) and [Digital Signatures](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures) sections.

For manifest claims signed with one of the test certificates, the C2PA Verify tool will display the message "The Content Credential issuer couldn't be recognized."  See [Using the Verify tool](../getting-started/verify.mdx#signing-information) for more information.


