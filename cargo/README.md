# Cargo / Dependabot integration

This directory exists so that we can have a Cargo.toml file that Dependabot can track for updates to our Rust projects:

- c2pa-rs
- c2patool

When new versions are posted, we want Dependabot to notice the new version, open up a PR in this repo, and trigger
a rebuild when merging to main so that README updates are reflected on opensource.contentauthenticity.org.
