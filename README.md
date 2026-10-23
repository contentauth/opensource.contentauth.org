# opensource.contentauth.org

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2fe0e49-4596-48e8-8e1a-9cf62d56bca2/deploy-status)](https://app.netlify.com/sites/cai-open-source/deploys)

## Overview

This repo contains the source code and content to generate the <https://opensource.contentauthenticity.org/> website.  This site is built using [Docusaurus 3](https://docusaurus.io/), a modern static site generator, and deployed on [Netlify](https://www.netlify.com/).

### Directory structure

The `docs` sub-directory contains documentation content (in markdown or `.mdx` format) in the following sub-directories:

- `includes`: Markdown content imported (transcluded) into other files.
- `static`: Additional assets such as images.
- `manifest`: Content for the [Understanding manifests](https://opensource.contentauthenticity.org/docs/manifest/understanding-manifest) section.
- Various other sub-directories for content sections, e.g. `durable-cr`, `manifest`, `signing`, etc.

Additionally, the [scripts/fetch-readme.js](./scripts/fetch-readme.js) script dynamically downloads documentation files (sometimes just the `README.md` but often other markdown files, too) from other repos in the SDK. See [Running the fetch script](#running-fetch-script). All fetched content lands under `docs/sdk-repos/`, kept separate from the hand-authored sub-directories listed above so it's obvious at a glance which folders get silently overwritten by the fetch script.

This table summarizes the content that this script fetches from other repos.

| Sub-directory (under `docs/sdk-repos/`) | Content fetched from... | Description | 
|-----------|-------------------------|-------------|
| `c2pa-cpp` | [c2pa-cpp](https://github.com/contentauth/c2pa-cpp) | C++ library docs. |
| `c2pa-swift` | [c2pa-swift](https://github.com/contentauth/c2pa-swift) | Mobile iOS/Swift library docs. |
| `c2pa-android` | [c2pa-android](https://github.com/contentauth/c2pa-android) | Android library docs. | 
| `c2pa-js/packages/c2pa-node` | [c2pa-node](https://github.com/contentauth/c2pa-js/tree/main/packages/c2pa-node) | Node library docs (packages/c2pa-node in c2pa-js monorepo). |
| `c2pa-python` | [c2pa-python](https://github.com/contentauth/c2pa-python) | Python library docs. |
| `c2pa-python example` | [c2pa-python-example](https://github.com/contentauth/c2pa-python-example) | Python example app. |
| `c2patool` | [c2patool](https://github.com/contentauth/c2patool) | C2PA Tool docs. |
| `js-sdk` | [c2pa-js](https://github.com/contentauth/c2pa-js) | JavaScript library docs. |
| `c2pa-rs` | [c2pa-rs](https://github.com/contentauth/c2pa-rs) | Rust library docs. |
| `trustmark` | [adobe/trustmark](https://github.com/adobe/trustmark/) | Trustmark docs |

## Installation

After cloning the repo, install dependencies as follows:

```
$ cd opensource.contentauth.org
$ npm install
```

## Local development

Build the site locally:

```
$ git clone git@github.com:contentauth/c2pa-js.git
$ cd opensource.contentauth.org
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Running fetch script

The `/scripts/fetch-readme.js` script pulls markdown files from other repos (e.g. `c2pa-rs`). To rerun this script for local build, enter this command:

```
npm run docs:fetch-readme
```

NOTE: If you need to get markdown files from a **new** repo that you added, then you need to manually add the sub-directory, add a `.gitkeep` file to it, and then commit it to this repository.

### Configuring remote docs (remote-docs.json)

The [remote-docs.json](./remote-docs.json) file is the single source of truth for markdown and other files that are fetched from external GitHub repositories and incorporated into the site. Both the fetch script and the Docusaurus sidebar navigation read from this file.

**To add a new remote doc:**

1. Add an entry to the `sources` array in `remote-docs.json`. Each entry has:
   - `repo` — GitHub repo in `org/repo` format (e.g. `contentauth/c2pa-rs`)
   - `path` — Path to the file in the source repo
   - `dest` — Local path where the file will be saved (e.g. `docs/sdk-repos/c2patool/readme.md` or `static/sb-alg-list.json`)
   - `branch` — (optional) Git branch to fetch from; defaults to `main`
   - `sidebar` — (optional) Include this to add the doc to the sidebar navigation:
     - `category` — Sidebar category (e.g. `c2patool`, `c2pa-rs`, `c2pa-python`)
     - `label` — Display label in the sidebar
     - `order` — Sort order within the category (lower numbers appear first)

2. If the destination directory does not exist, create it and add an empty `.gitkeep` file:
   ```
   $ mkdir -p docs/your-section
   $ touch docs/your-section/.gitkeep
   ```

3. Run the fetch script to download the file:
   ```
   npm run docs:fetch-readme
   ```

Entries with `{ "_comment": "Section name" }` are section headers only—they are ignored by the scripts and help organize the file for readability.

### Building

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Internationalization

The site supports English, French, Italian, German, and Spanish. English keeps
its existing URLs; other languages use `/fr/`, `/it/`, `/de/`, and `/es/`.
`npm run build` builds all locales and checks translation source hashes first.
Use `npm start -- --locale fr` to develop one locale, or
`npm run build -- --locale fr` to build it. A single-locale build uses the site
root; use the combined build to test language switching and production prefixes.

Translations mirror the English filenames under
`i18n/<locale>/docusaurus-plugin-content-docs/current/`. Missing translations fall
back to English with a localized notice. Fallback content carries `lang="en"`
and `noindex`; the localized navigation remains available. Translation drafts
also carry a review notice and `noindex`. Docusaurus excludes these pages from
the sitemap.

Introduction currently has AI-generated translation drafts in all four target
languages. These drafts have not received human linguistic review. Getting
Started, FAQs, and Glossary remain English until reviewers supply translations.

To add or review a translation:

1. Translate the complete document, preserving its ID, slug, heading anchors,
   MDX imports, JSX, technical identifiers, and code. Use the matching filename.
2. Compute the English source hash with `shasum -a 256 docs/<source-file>`.
3. Add `translation_source_hash` and `translation_status: draft` to the localized
   frontmatter. Do not update the hash without checking the changed English.
4. Ask a language reviewer to check terminology, accuracy, links, and images.
   After approval, set `translation_status: reviewed`.
5. Run `npm run i18n:check`, `npm run i18n:test`, and `npm run build`.

`npm run i18n:check` fails on stale or missing source hashes and invalid review
states. It reports missing pilot translations without blocking the sparse pilot.
Use `npm run i18n:check -- --require-complete` as the launch gate for all 16
reviewed pilot translations.

Extract English UI catalogs with `npm run write-translations -- --locale en`.
Repeat with each target locale to update its catalogs. Extraction preserves
existing translations; it does not translate document content. Keep stable
sidebar keys and message IDs for future TMS synchronization. External SDK
documents continue to land under `docs/sdk-repos/`; the fetch script does not
write into `i18n/`.

For sparse translations, test links from English fallback documents to localized
documents. A Markdown source-file link can become unresolved when Docusaurus
selects the translated file. Use the corresponding stable relative page route
where needed, as the glossary does for Introduction.

See [the internationalization plan](I18N.md) for rollout status, verification
results, TMS requirements, and remaining publishing decisions.

### Deployment

Deployments are handled automatically by Netlify. Please open up a pull request with any changes and a preview site will be created automatically so you can share what the rendered site will look like before merging.

### Forcing a site rebuild

To rebuild the site when one of the SDK/tool repos hasn't been versioned, simply make any change to the `main` branch of this repo. This is a workaround until a manual site rebuild capability is added.

## License

[![CC BY 4.0][cc-by-image]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
