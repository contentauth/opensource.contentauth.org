# opensource.contentauth.org

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2fe0e49-4596-48e8-8e1a-9cf62d56bca2/deploy-status)](https://app.netlify.com/sites/contentauth/deploys)

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator, and deployed
on [Netlify](https://www.netlify.com/).

## Installation

After cloning the repo, install dependencies as follows:

```
$ cd opensource.contentauth.org
$ npm install
```

## Local development

**Prerequisite**: To build the site locally, you must first check out the JavaScript library in a sibling directory and build the API docs there.  In the parent directory of `opensource.contentauth.org`, enter these commands:

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

The `/scripts/fetch-readme.js` script pulls markdown files from other repos (e.g. `c2patool`). To rerun this script for local build, enter this command:

```
npm run docs:fetch-readme
```

NOTE: If you added a **new** repo to get .md files from, then you need to manually add the directory, add a `.gitkeep` file to it, and then commit it to Git.

### Generate JavaScript SDK API docs

The `/scripts/generate-api-docs/index.js` script generates API docs for the JS SDK. To run this script for local build, enter this command:

```
npm run docs:generate-api-docs
```

## Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Deployments are handled automatically by Netlify. Please open up a pull request with any changes and a preview site
should be created automatically so that the preview can be shared before merging.

### Forcing a site rebuild

To rebuild the site when one of the SDK/tool repos hasn't been versioned, simply make any change to the `main` branch of this repo. This is a workaround until a manual site rebuild capability is added.

## License

[![CC BY 4.0][cc-by-image]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
