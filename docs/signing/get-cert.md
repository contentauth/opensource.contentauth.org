---
id: get-cert
title: Getting a signing certificate
---

:::warning Important
Best practices for handling keys and certificates are beyond the scope of this documentation.  Always protect your private keys with the highest level of security; for example, never share them through insecure channels such as email.
:::

To sign manifest claims, you must have an X.509 v3 security certificate and key that conform to the requirements laid out in the [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates). Additionally, the C2PA program provides a [Certificate Policy](https://github.com/c2pa-org/conformance-public/blob/main/docs/current/C2PA%20Certificate%20Policy.pdf) containing the requirements for a certification authority (CA) to follow when issuing C2PA claim signing certificates and the requirements for the use of such certificates.


## Purchasing a certificate

:::note
The [C2PA conformance program](https://c2pa.org/conformance/) establishes the requirements governing the issuance of C2PA claim signing certificates for use by product developers.  Conforming generator products must use a certificate from a CA on the C2PA trust list.  See [C2PA conformance program](../conformance/index.mdx) for more information.
:::

The process to purchase a certificate and key is different for each CA: You might be able to simply click a "Buy" button on the CA's website. Or your can make your own key and use it to create a certificate signing request (CSR) that you send to the CA. Regardless of the process, what you get back is a signed certificate that you use to create a certificate chain.

The certificate chain starts with the certificate from the last tool that signed the manifest (known as the "end-entity") followed by the certificate that signed it, and so on, back to the original CA issuer. This enables a validating application to determine that the manifest is valid because the certificate chain goes back to a trusted root certificate authority.

### Certificate authorities (CAs)

To develop a conforming generator product, you must purchase a signing certificate from a certificate authority (CA) on the C2PA trust list, such as:


- [Digicert](https://www.digicert.com/solutions/c2pa-media-trust) 
- [Trufo](https://trufo.ai/tca)
- [SSL.com](https://www.ssl.com/article/c2pa-enterprise-content-authenticity-solutions/)

:::note
The above list of CAs was complete as of January, 2026. Other CAs may have been added subsequently. See the [**Conformance Explorer > C2PA Trust List**](https://spec.c2pa.org/conformance-explorer/) for the most up-to-date list.
:::

### Certificate signing requests (CSRs)

A CSR is just an unsigned certificate that's a template for the certificate that you're requesting. The CA creates a new certificate with the parameters specified in the CSR, and signs it with their root certificate, which makes it a valid certificate.

A CSR comprises a public key, as well as ["distinguished name" information](https://knowledge.digicert.com/general-information/what-is-a-distinguished-name) that identifies the individual or organization requesting the certificate. The distinguished name includes a common name, organization, city, state, country, and e-mail address. Not all of these fields are required and will vary depending with the assurance level of the desired certificate.

:::tip
For the [Inspect tool on Adobe Content Authenticity (Beta)](https://inspect.cr) to display your organization name in the Content Credentials, your CSR must include the "O" or Organization Name attribute in the distinguished name information. 
:::

You sign the CSR with your private key; this proves to the CA that you have control of the private key that corresponds to the public key included in the CSR. Once the requested information in a CSR passes a vetting process and domain control is established, the CA may sign the public key to indicate that it can be publicly trusted.

## Certificate requirements

The [C2PA certificate policy](https://github.com/c2pa-org/conformance-public/blob/main/docs/current/C2PA%20Certificate%20Policy.pdf) establishes the requirements governing the issuance of C2PA claim signing certificates.  

A signing certificate and key (credentials) must conform to the requirements in the [C2PA specification X.509 Certificates section](https://c2pa.org/specifications/specifications/2.3/specs/C2PA_Specification.html#x509_certificates); specifically, it must:

### Organization name

If you want the [Inspect tool on Adobe Content Authenticity (Beta)](https://inspect.cr) to display your organization name in the Content Credentials, your certificate must include the "O" or [Organization Name attribute](https://www.alvestrand.no/objectid/2.5.4.10.html) (OID value 2.5.4.10) in the distinguished name information. The CA may require some validation steps to prove you are part of that organization (details vary by CA).

### Signature types

The following table describes the signature algorithms and types that the CAI SDK supports. You must supply credentials (certificates and keys) that correspond to the signing algorithm (`signatureAlgorithm`). Signing/validation will fail if the the supplied credentials don't support the signature type.

This table is provided for convenience, and is based on information in the [C2PA specification](https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates). The specification is authoritative; refer to it for more details.  The C2PA specification also covers two other certificates for timestamp responses and OCSP certificate revocation, which are not covered here.

| Certificate `signatureAlgorithm` | Description  | Recommended signature type | RFC Reference |
| -------------------------------- | ------------ | -------------------------- | ------------- |
| `ecdsa-with-SHA256`                                       | ECDSA with SHA-256                                            | ES256<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `ecdsa-with-SHA384`                                       | ECDSA with SHA-384                                            | ES384<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `ecdsa-with-SHA512`                                       | ECDSA with SHA-512                                            | ES512<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `sha256WithRSAEncryption`                                 | RSASSA-PSS with SHA-256<br/>MGF1 with SHA-256                 | PS256                      | [RFC 8017 appendix A.2.4](https://www.rfc-editor.org/rfc/rfc8017.html#appendix-A.2.4) |
| `sha384WithRSAEncryption`                                 | RSASSA-PSS<br/>SHA-384, MGF1 with SHA-384                     | PS384                      | [RFC 8017 appendix A.2.4](https://www.rfc-editor.org/rfc/rfc8017.html#appendix-A.2.4) |
| `sha512WithRSAEncryption`                                 | RSASSA-PSS<br/>SHA-512, MGF1 with SHA-512                     | PS512                      | [RFC 8017 appendix A.2.4](https://www.rfc-editor.org/rfc/rfc8017.html#appendix-A.2.4) |
| `id-RSASSA-PSS` - ASN1 OID: prime256v1, NIST CURVE: P-256 | RSA-PSS                                                       | ES256<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `id-RSASSA-PSS` - ASN1 OID: secp384r1                     | RSA-PSS                                                       | ES384<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `id-RSASSA-PSS` - ASN1 OID: secp521r1                     | RSA-PSS                                                       | ES512<sup>\*</sup>         | [RFC 5758 section 3.2](https://www.rfc-editor.org/rfc/rfc5758.html#section-3.2)       |
| `id-Ed25519`                                              | EdDSA (Edwards-Curve DSA) with SHA-512 (SHA-2) and Curve25519 | Ed25519 instance ONLY.     | [RFC 8410 section 3](https://www.rfc-editor.org/rfc/rfc8410.html#section-3)           |

<sup>*</sup> ES256, ES384, and ES512 signatures must be in IEEE P1363 format.




