:::warning Warning
Accessing a private key and certificate directly from the file system as shown in these examples is fine during development, but doing so in production is **not secure**. Instead use a Key Management Service (KMS) or a hardware security module (HSM) to access the certificate and key; For more information, see [Using a certificate in production](../signing/prod-cert.mdx). 
:::