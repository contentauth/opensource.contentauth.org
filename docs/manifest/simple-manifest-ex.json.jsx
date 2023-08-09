{
  "active_manifest": "contentauth:urn:uuid:5a08e472-974c-422e-b38a-d6c7326481a5",
  "manifests": {
    "contentauth:urn:uuid:5a08e472-974c-422e-b38a-d6c7326481a5": {
      "claim_generator": "make_test_images/0.12.0 c2pa-rs/0.12.0",
      "title": "C.jpg",
      "format": "image/jpeg",
      "instance_id": "xmp:iid:e928fac1-8473-4c70-8219-369e91d4e58d",
      "thumbnail": {
        "format": "image/jpeg",
        "identifier": "contentauth-urn-uuid-5a08e472-974c-422e-b38a-d6c7326481a5.jpg"
      },
      "ingredients": [],
      "assertions": [
        {
          "label": "stds.schema-org.CreativeWork",
          "data": {
            "@context": "http://schema.org/",
            "@type": "CreativeWork",
            "author": [
              {
                "@type": "Person",
                "name": "Gavin Peacock"
              }
            ]
          },
          "kind": "Json"
        },
        {
          "label": "c2pa.actions",
          "data": {
            "actions": [
              {
                "action": "c2pa.created"
              },
              {
                "action": "c2pa.drawing",
                "parameters": {
                  "name": "gradient"
                }
              }
            ]
          }
        }
      ],
      "signature_info": {
        "issuer": "C2PA Test Signing Cert",
        "cert_serial_number": "720724073027128164015125666832722375746636448153",
        "time": "2022-08-19T19:03:41+00:00"
      },
      "label": "contentauth:urn:uuid:5a08e472-974c-422e-b38a-d6c7326481a5"
    }
  }
}
