# opensource.contentauth.org

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2fe0e49-4596-48e8-8e1a-9cf62d56bca2/deploy-status)](https://app.netlify.com/sites/contentauth/deploys)

## Overview

This repo contains the source code and content to generate the <https://opensource.contentauthenticity.org/> website.  This site is built using [Docusaurus 2](https://docusaurus.io/), a modern static site generator, and deployed on [Netlify](https://www.netlify.com/).

### Directory structure

The `docs` sub-directory contains documentation content (in markdown or `.mdx` format) in the following sub-directories:
- [`js-sdk/api`](./docs/js-sdk/api): [API documentation](https://opensource.contentauthenticity.org/docs/js-sdk/api/) for the JavaScript library generated from the source code; see [Generating JavaScript API docs](#generating-javascript-sdk-api-docs).
- [`js-sdk`](./docs/js-sdk/): [Other documentation](https://opensource.contentauthenticity.org/docs/js-sdk/getting-started/overview) for the JavaScript library.
(./scripts/generate-api-docs/index.js)
- `includes`: Markdown content imported (transcluded) into other files.
- `manifest`: Content for the [Understanding manifests](https://opensource.contentauthenticity.org/docs/manifest/understanding-manifest) section.
- `static`: Additional assets such as images.

Additionally, the [scripts/fetch-readme.js](./scripts/fetch-readme.js) script dynamically downloads documentation files (sometimes just the `README.md` but often other markdown files, too) from other repos in the SDK. See [Running the fetch script](#running-fetch-script).

This table summarizes the content that this script fetches from other repos.

| Sub-directory | Content fetched from... | Description | 
|-----------|-------------------------|-------------|
| `c2pa-c` | [c2pa-c](https://github.com/contentauth/c2pa-c) | C library docs. |
| `c2pa-min` | [c2pa-min](https://github.com/contentauth/c2pa-min) | Minimal Rust example app. |
| `c2pa-node` | [c2pa-node](https://github.com/contentauth/c2pa-node) | Node library docs. |
| `c2pa-node-example`  | [c2pa-node-example](https://github.com/contentauth/c2pa-node-example) | Node example app.|
| `c2pa-python` | [c2pa-python](https://github.com/contentauth/c2pa-python) | Python library docs. |
| `c2pa-python example` | [c2pa-python-example](https://github.com/contentauth/c2pa-python-example) | Python example app. |
| `c2pa-service-example` | [c2patool-service-example](https://github.com/contentauth/c2patool-service-example) | C2PA Tool service example app. |
| `c2patool` | [c2pa-rs cli directory](https://github.com/contentauth/c2pa-rs/cli) | C2PA Tool docs. |
| `js-sdk` | [c2pa-js](https://github.com/contentauth/c2pa-js) | JavaScript library docs. |
| `rust-sdk` | [c2pa-rs](https://github.com/contentauth/c2pa-rs) | Rust library docs. |

The [Manifest store reference](https://opensource.contentauthenticity.org/docs/manifest/manifest-ref) is an HTML file generated by the  [json-manifest-reference](https://github.com/contentauth/json-manifest-reference) repository and imported manually.

## Installation

After cloning the repo, install dependencies as follows:

```
$ cd opensource.contentauth.org
$ npm install
```

## Local development

**Prerequisite**: To build the site locally, you must first check out the JavaScript library in a sibling directory and build the API docs there.  In the parent directory of the `opensource.contentauth.org` directory, enter these commands:

```
$ git clone git@github.com:contentauth/c2pa-js.git
$ cd opensource.contentauth.org
$ npm run docs:generate-api-docs 
```

Then you can build and run the doc site with this command:

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Running fetch script

The `/scripts/fetch-readme.js` script pulls markdown files from other repos (e.g. `c2pa-rs`). To rerun this script for local build, enter this command:

```
npm run docs:fetch-readme
```

NOTE: If you need to get markdown files from a **new** repo that you added, then you need to manually add the sub-directory, add a `.gitkeep` file to it, and then commit it to this repository.

### Generating JavaScript SDK API docs

The `/scripts/generate-api-docs/index.js` script generates API docs for the JS SDK (assuming you've checked it out in a sibling directory). To run this script for local build, enter this command:

```
npm run docs:generate-api-docs
```

### Building

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

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
