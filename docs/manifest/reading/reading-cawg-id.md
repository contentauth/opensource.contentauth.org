---
id: reading-cawg-id
title: Reading CAWG identity assertions
---

The [Creator Assertions Working Group (CAWG)](https://cawg.io/) identity assertion enables a credential holder to prove control over a digital identity and to use that identity to document a content creator’s role(s) in a C2PA asset’s lifecycle.

The SDK can read and validate CAWG identity assertions provided:

- Using an [X.509 certificate](https://cawg.io/identity/1.1/#_x_509_certificates_and_cose_signatures) to sign the identity claims. Enterprises or large organizations can use this approach to assert their identity in a particular trust ecosystem; for example, a news organization or publisher. The SDK can validate and sign these claims.
- Using an [identity claim aggregator](https://cawg.io/identity/1.1/#_identity_claims_aggregation).  Individuals can use this approach to document their role in creating an asset by using identity signals collected and verified by a third-party aggregator. The SDK can validate these claims only.  Signing is not supported.

## Assertions signed using a certificate

In an identity assertion provided by using an X.509 certificate, the value of `signer_payload.sig_type` is `cawg.x509.cose`. The signature value must be a COSE signature as described in the [CAWG Identity Assertion technical specification](https://cawg.io/identity/1.1/#_x_509_certificates_and_cose_signatures).

## Assertions signed using a claim aggregator

An identity assertion can also be signed using a trusted third-party intermediary known as an [_identity claims aggregator_](https://cawg.io/identity/1.1/#_identity_claims_aggregation). The identity claims aggregator:

- Collects and verifies identity attestation claims from various identity providers such as social media sites and ID verification vendors.
- Creates a unique asset-specific credential that binds the identity attestation claims to a specific asset.

In an identity assertion provided by using an identity clarims aggregator, the value of `signer_payload.sig_type` is `cawg.identity_claims_aggregation`.

### Example

An identity assertion using an identity claims aggregator has this general form in JSON:

```json
"assertions": [
  ...
  {
    "label": "cawg.identity",
    "data": {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://cawg.io/identity/1.1/ica/context/"
      ],
      "type": [
        "VerifiableCredential",
        "IdentityClaimsAggregationCredential"
      ],
      "issuer": "did:web:connected-identities.identity.adobe.com",
      "validFrom": "2025-04-29T17:34:44Z",
      "verifiedIdentities": [
        {
          "type": "cawg.<type>",
          "username": "<string>",
          "uri": "<uri>",
          "verifiedAt": "<DateTime>",
          "provider": {
            "id": "<string>",
            "name": "<string>"
          }
        },
        ...
      ]
    }
  }
]
```

## Verified identity types

The following table describes the allowed values of the `type` property of `verifiedIdentities` array elements.

| Value        |  Meaning |
|--------------|----------|
| `cawg.document_verification` | The identity provider verified one or more government-issued identity documents presented by the content creator.
| `cawg.web_site` | The content creator has proven control over a specific domain to the identity claims aggregator.
| `cawg.affiliation` | The identity provider is attesting to the content creator’s membership in an organization. This could be a professional organization or an employment relationship.
| `cawg.social_media` | The content creator has demonstrated control over an account (typically a social media account) hosted by the identity provider.
| `cawg.crypto_wallet` | The content creator has demonstrated control over an account (typically a crypto-wallet) hosted by the identity provider.

:::note
The above table is based on the [CAWG identity assertion technical specifications](https://cawg.io/identity/1.1/#vc-credentialsubject-verifiedidentity-type).
:::

### Example

```json
"assertions": [
  ...
  {
    "label": "cawg.identity",
    "data": {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://cawg.io/identity/1.1/ica/context/"
      ],
      "type": [
        "VerifiableCredential",
        "IdentityClaimsAggregationCredential"
      ],
      "issuer": "did:web:connected-identities.identity.adobe.com",
      "validFrom": "2025-04-29T17:34:44Z",
      "verifiedIdentities": [
        {
          "type": "cawg.social_media",
          "username": "xyz",
          "uri": "https://www.instagram.com/xyz",
          "verifiedAt": "2024-10-08T18:04:08Z",
          "provider": {
            "id": "https://instagram.com",
            "name": "instagram"
          }
        },
        {
          "type": "cawg.social_media",
          "username": "xyz",
          "uri": "https://www.behance.net/xyz",
          "verifiedAt": "2024-10-22T19:31:17Z",
          "provider": {
            "id": "https://behance.net",
            "name": "behance"
          }
        },
        {
          "type": "cawg.social_media",
          "username": "J Smith",
          "uri": "https://www.linkedin.com/in/jsmith",
          "verifiedAt": "2024-10-08T18:03:41Z",
          "provider": {
            "id": "https://linkedin.com",
            "name": "linkedin"
          }
        },
        {
          "type": "cawg.social_media",
          "username": "xyz",
          "uri": "https://twitter.com/xyz",
          "verifiedAt": "2024-10-08T18:03:49Z",
          "provider": {
            "id": "https://twitter.com",
            "name": "twitter"
          }
        }
      ],
      "credentialSchema": [
        {
          "id": "https://cawg.io/identity/1.1/ica/schema/",
          "type": "JSONSchema"
        }
      ]
    }
  }
  ...
]
```

