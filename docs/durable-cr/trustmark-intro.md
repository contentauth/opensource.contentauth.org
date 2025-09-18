---
id: trustmark-intro
title: TrustMark watermarking
---

TrustMark is an open-source universal watermarking system for images that:  

- Can encode, decode, and remove watermarks from images.
- Works with arbitrary resolution images.
- Has implementations in Python (using PyTorch), [Rust](trustmark/rust/README.md), and [JavaScript](trustmark/js/README.md) (both using ONNX).

:::info
For full technical details and help getting started with TrustMark, see [TrustMark - Overview](trustmark/README.md).
:::

## Variants

TrustMark has three primary model variants, each with different characteristics.

Images encoded with one variant cannot be decoded with another variant, so you need to stick with the same variant throughout your pipeline.

- **Variant Q (Default)** Use in most cases, where you want a good balance between robustness and imperceptibility.  PSNR is 43-45 dB. 
- **Variant P** - Use when image quality is the top priority. PSNR is 48-50 dB.
- **Variant C (Compact)** - Use if you need to minimize model size and can live with slightly lower visual quality. PSNR is 38-39 dB.

The general recommendation is to use either:
- Variant Q for most use cases.
- Variant P when visual quality is paramount.

## About PSNR

PSNR (Peak Signal-to-Noise Ratio) is a measure of image quality when comparing an original image to the watermarked image. PSNR is measured in decibels (dB), with higher values indicating better quality:
- Values around 45+ dB typically indicate very good quality.
- Values around 40 dB indicate acceptable quality.
- Values below 30 dB indicate poor quality, unacceptable for most uses.

