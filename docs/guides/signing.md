---
id: signing-manifests
title: Signing manifests
---

## Overview

Signing C2PA manifests requires an end-entity certificate that complies with the [C2PA Trust Model](https://c2pa.org/specifications/specifications/1.1/specs/C2PA_Specification.html#_trust_model). C2PA follows the Public Key Infrastructure (PKI) using your private key and public certificates in the signing process.

:::note
Best practices for handling keys and certificates are available from many sources and not directly covered here. Always protect your private keys with the highest level of security.
:::note

The open source [c2patool](/docs/c2patool) and [Rust SDK](/docs/rust-sdk) support signing with the following signature types:

- ES256 (ECDSA with SHA-256)
- ES384 (ECDSA with SHA-384)
- ES512 (ECDSA with SHA-512)
- PS256 (RSASSA-PSS using SHA-256 and MGF1 with SHA-256)
- PS384 (RSASSA-PSS using SHA-384 and MGF1 with SHA-384)
- PS512 (RSASSA-PSS using SHA-512 and MGF1 with SHA-512)
- EdDSA (Edwards-Curve DSA)
  - Ed25519 instance only. No other EdDSA instances are allowed.

You must supply credentials (certificates and keys) that correspond to your desired signing algorithm. Signing/validation will fail if the signature type is not supported by the supplied credentials.

Here is a condensed summary of important credential information provided in the [Trust Model section](https://c2pa.org/specifications/specifications/1.1/specs/C2PA_Specification.html#_trust_model) of the C2PA specification. See the [spec](https://c2pa.org/specifications/specifications/1.1/specs/C2PA_Specification.html) for complete details.

- Certificate must follow the X509 V3 specification
- Certificate's `signatureAlgorithm` must be one of:
  - `ecdsa-with-SHA256` ([RFC 5758 section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2))
  - `ecdsa-with-SHA384` ([RFC 5758 section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2))
  - `ecdsa-with-SHA512` ([RFC 5758 section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2))
  - `sha256WithRSAEncryption` ([RFC 8017 appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4))
  - `sha384WithRSAEncryption` ([RFC 8017 appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4))
  - `sha512WithRSAEncryption` ([RFC 8017 appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4))
  - `id-RSASSA-PSS` ([RFC 8017 appendix A.2.3](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.3))
  - `id-Ed25519` ([RFC 8410 section 3](https://datatracker.ietf.org/doc/html/rfc8410#section-3))
- The Key Usage (KU) extension must be present and marked as critical. Certificates used to sign C2PA manifests must assert the `digitalSignature` bit.
- The Extended Key Usage (EKU) extension must be present and non-empty in any certificate where the Basic Constraints extension is absent or the certificate authority (CA) Boolean is not asserted.
  - The `anyExtendedKeyUsageEKU` (2.5.29.37.0) must not be present.
  - If the configuration store does not contain a list of EKUs, a certificate that signs C2PA manifests must be valid for the `id-kp-emailProtection` (1.3.6.1.5.5.7.3.4) purpose.
  - The `id-kp-emailProtection` purpose is not implicitly included by default if a list of EKUs has been configured. If desired, it must explicitly be added to the list in the configuration store.

### Recommended signature type by signatureAlgorithm

| signatureAlgorithm                                      | Recommended Signature type |
| ------------------------------------------------------- | :------------------------: |
| `ecdsa-with-SHA256`                                     |           ES256            |
| `ecdsa-with-SHA384`                                     |           ES384            |
| `ecdsa-with-SHA512`                                     |           ES512            |
| `sha256WithRSAEncryption`                               |           PS256            |
| `sha256WithRSAEncryption`                               |           PS384            |
| `sha256WithRSAEncryption`                               |           PS512            |
| `id-RSASSA-PSS` ASN1 OID: prime256v1, NIST CURVE: P-256 |           ES256            |
| `id-RSASSA-PSS` ASN1 OID: secp384r1                     |           ES384            |
| `id-RSASSA-PSS` ASN1 OID: secp521r1                     |           ES512            |
| `id-Ed2551` Ed25519                                     |          Ed25519           |

Trust lists connect the end-entity certificate that signed a manifest back to the originating root CA. This is accomplished by supplying the subordinate public X.509 certificates forming the trust chain (the public X.509 certificate chain). If those are not supplied, you can use a private credential store to validate the certificate trust chain. If you do not supply a certificate chain or trust list, validators may reject the manifest. See the C2PA specification for more details.

Two other certificates are supported in the C2PA spec for timestamp responses and OCSP certificate revocation. Neither of those are covered here.

## Example credential generation

Here is an example of generating a C2PA-compliant set of credentials using [GlobalSign](http://globalsign.com/) certificate authority (CA).

:::note
Credential management is a complex topic and different for every organization, so use this tutorial only as a demonstration of how C2PA operates. Other certificate providers may have alternate ways of providing your private key and certificate.
:::note

### Step 1: Purchase compliant credentials

This example uses the [PersonSign1](https://shop.globalsign.com/en/secure-email) certificate that contains KU and EKU values compliant with C2PA manifest signing. Follow the instructions to purchase and download your `.pfx` file. This file is a PKCS12 container that holds your certificate chain and private signing key.

:::info
Other certificate vendors may include only the end-entity certificate and you must manually download the rest of the certificate chain.
:::info

The rest of this tutorial uses OpenSSL (a set of cryptographic utilities). If OpenSSL is not installed on your system, see [OpenSSL](https://www.openssl.org/source/) for the source distribution or the [list of unofficial binary distributions](https://wiki.openssl.org/index.php/Binaries).

### Step 2: Extract the certificate and key using OpenSSL

Use the commands below to extract the key and certificate chain. If prompted, enter the password that was used to generate the `.pfx` file.

:::tip
Make sure you are using a recent version of OpenSSL.
:::tip

#### Extract the key

```shell
openssl pkcs12 -in mycertfile.pfx -nocerts -out mykey.pem -nodes
```

#### Extract the certificate chain

For many certificate providers, the `.pfx` file contains not just your certificate but the complete certificate trust chain. When the `.pfx` file does not contain the certificate chain, you can obtain it from your provider.

```shell
openssl pkcs12 -in mycertfile.pfx -nokeys -out mycerts.pem
```

:::note
OpenSSL may report errors, but if it generates the output file, you can ignore the messages. The following error message means the `.pfx` was encrypted with an older standard:

```
Shrouded Keybag: pbeWithSHA1And3- KeyTripleDES-CBC, Iteration 2000
PKCS7 Encrypted data: pbeWithSHA1And40BitRC2- CBC, Iteration 2000
Error outputting keys and certificates
```

To work around this error, add `-legacy` to the command.
:::note

## Using credentials with c2patool

To use the credentials extracted above you must know the signature types they support. Typically, this information is available from your certificate provider. If it is not, enter this OpenSSL command to dump certificate information:

```shell
openssl x509 -inform PEM -in mycerts.pem -text
```

This command produces a text summary of the certificate properties, as shown in the example below. Look for a line containing `Signature Algorithm`. See the table above to determine the corresponding signature type. For this example with a certificate issued by GlobalSign, `Signature Algorithm: sha256WithRSAEncryption` corresponds to the PS256 signature type.

```
Certificate:
	Data:
		Version: 3 (0x2)
		Serial Number:
				73:0d:01:c3:04:06:62:e4:60:0a:0b:0c
		Signature Algorithm: sha256WithRSAEncryption
		Issuer: C = BE, O = GlobalSign nv-sa, CN = GlobalSign GCC R3 PersonalSign 1 CA 2020
		Validity
				Not Before: Oct 13 13:33:02 2022 GMT
				Not After : Oct 14 13:33:02 2023 GMT
		Subject: CN = someuser@someemail.com, emailAddress = someuser@someemail.com
		Subject Public Key Info:
				Public Key Algorithm: rsaEncryption
						Public-Key: (2048 bit)
.
.
.
```

You now have all the needed information to configure c2patool for manifest signing. Edit your [manifest definition file](https://github.com/contentauth/c2patool#manifest-definition-file) to have the following content:

```json
"alg": "ps256",
"private_key": "mykey.pem",
"sign_cert": "mycerts.pem"
```

:::note
The `private_key` and `sign_cert` parameters must be full paths to the key and certificate chain files generated above.
:::note

You can now use c2patool to add a manifest as described in the [c2patool documentation](../c2patool/#adding-a-manifest-to-an-asset-file). The command will be something like this:

```
c2patool -m myconfig.json -o destination.jpg source.jpg
```

The example above uses the information in `myconfig.json` to add a new manifest to output `destination.jpg` using source `source.jpg`. The manifest will be signed using the PS256 signature algorithm with private key `mykey.pem`. The manifest will contain the trust chain specified in `mycerts.pem`.
