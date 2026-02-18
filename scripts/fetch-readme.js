const fetch = require('node-fetch');
const { resolve } = require('path');
const { writeFile } = require('fs/promises');
const url = require('url');

const GITHUB_HOST = 'https://github.com';
const RAW_GITHUB_HOST = 'https://raw.githubusercontent.com';

const mdLinkRegex =
  /\[([\w\s\d\-]+)\]\(((?:\/|https?:\/\/|\.)[\w\d\-./?=#]+)\)/g;

/*
After adding a new file to below array, you must manually create the directory
and add an empty .gitkeep file to it so the build will work.  For example:
$ cd opensource.contentauth.org/docs
$ mkdir c2pa_service_example
$ cd c2pa_service_example
$ touch .gitkeep
*/

const readmes = [
  /* Old js-sdk examples - Removed 
  {
    dest: resolve(
      __dirname,
      '../docs/js-sdk/examples/view-manifest/index.html',
    ),
    repo: 'contentauth/c2pa-js-legacy',
    path: 'examples/minimal-ts-vite/examples/active-manifest/index.html',
  },
  {
    dest: resolve(__dirname, '../docs/js-sdk/examples/view-manifest/main.ts'),
    repo: 'contentauth/c2pa-js-legacy',
    path: 'examples/minimal-ts-vite/examples/active-manifest/main.ts',
  },
  // Vite Quickstart
  {
    dest: resolve(__dirname, '../docs/js-sdk/examples/quickstart/vite-main.ts'),
    repo: 'contentauth/c2pa-js-legacy',
    path: 'examples/minimal-ts-vite/examples/cdn/main.ts',
  },
  // Rollup Quickstart
  {
    dest: resolve(
      __dirname,
      '../docs/js-sdk/examples/quickstart/rollup-main.ts',
    ),
    repo: 'contentauth/c2pa-js-legacy',
    path: 'examples/minimal-ts-rollup/src/main.ts',
  },
  // WebPack Quickstart
  {
    dest: resolve(
      __dirname,
      '../docs/js-sdk/examples/quickstart/webpack-main.ts',
    ),
    repo: 'contentauth/c2pa-js-legacy',
    path: 'examples/minimal-ts-webpack/src/index.ts',
  },
*/
  // New JavaScript SDK (9/16/2025)
  {
    dest: resolve(__dirname, '../docs/c2pa-js/readme.md'),
    repo: 'contentauth/c2pa-js',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-js/c2pa-web-readme.md'),
    repo: 'contentauth/c2pa-js',
    path: 'packages/c2pa-web/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-js/c2pa-types-readme.md'),
    repo: 'contentauth/c2pa-js',
    path: 'packages/c2pa-types/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-js/c2pa-wasm-readme.md'),
    repo: 'contentauth/c2pa-js',
    path: 'packages/c2pa-wasm/README.md',
  },
  // c2patool
  {
    dest: resolve(__dirname, '../docs/c2patool/readme.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/manifest.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/docs/manifest.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/x_509.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/docs/x_509.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/changelog.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/CHANGELOG.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/usage.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/docs/usage.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/cawg_x509_signing.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'cli/docs/cawg_x509_signing.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
  },
  // Old Node.js lib
  {
    dest: resolve(__dirname, '../docs/c2pa-node/readme.md'),
    repo: 'contentauth/c2pa-node',
    path: 'README.md',
  },
  // Node.js lib
  {
    dest: resolve(__dirname, '../docs/c2pa-node-v2/readme.md'),
    repo: 'contentauth/c2pa-node-v2',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-node-v2/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
  },
  // Python lib
  {
    dest: resolve(__dirname, '../docs/c2pa-python/readme.md'),
    repo: 'contentauth/c2pa-python',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/usage.md'),
    repo: 'contentauth/c2pa-python',
    path: 'docs/usage.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/release-notes.md'),
    repo: 'contentauth/c2pa-python',
    path: 'docs/release-notes.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/examples.md'),
    repo: 'contentauth/c2pa-python',
    path: 'examples/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python-example/readme.md'),
    repo: 'contentauth/c2pa-python-example',
    path: 'README.md',
  },
  // C lib
  {
    dest: resolve(__dirname, '../docs/c2pa-c/readme.md'),
    repo: 'contentauth/c2pa-c',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-c/docs/usage.md'),
    repo: 'contentauth/c2pa-c',
    path: 'docs/usage.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-c/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
  },
  // Rust lib
  {
    dest: resolve(__dirname, '../docs/rust-sdk/readme.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/usage.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/usage.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/context.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/context.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/intents-and-archives.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/intents-and-archives.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/working-stores.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/working-stores.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/cawg-id.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/cawg-identity.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/settings.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/settings.md',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/release-notes.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/release-notes.md',
  },
  {
    dest: resolve(__dirname, '../static/sb-alg-list.json'),
    repo: 'c2pa-org/softbinding-algorithm-list',
    path: 'softbinding-algorithm-list.json',
  },
  // TrustMark
  {
    dest: resolve(__dirname, '../docs/trustmark/README.md'),
    repo: 'adobe/trustmark',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/trustmark/python/CONFIG.md'),
    repo: 'adobe/trustmark',
    path: 'python/CONFIG.md',
  },
  {
    dest: resolve(__dirname, '../docs/trustmark/FAQ.md'),
    repo: 'adobe/trustmark',
    path: 'FAQ.md',
  },
  {
    dest: resolve(__dirname, '../docs/trustmark/c2pa/README.md'),
    repo: 'adobe/trustmark',
    path: 'c2pa/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/trustmark/js/README.md'),
    repo: 'adobe/trustmark',
    path: 'js/README.md',
  },
  {
    dest: resolve(__dirname, '../docs/trustmark/rust/README.md'),
    repo: 'adobe/trustmark',
    path: 'rust/README.md',
  },
  {
    dest: resolve(
      __dirname,
      '../docs/trustmark/rust/crates/trustmark-cli/README.md',
    ),
    repo: 'adobe/trustmark',
    path: 'rust/crates/trustmark-cli/README.md',
  },
  // Mobile libraries
  {
    dest: resolve(__dirname, '../docs/c2pa-ios/README.md'),
    repo: 'contentauth/c2pa-ios',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-android/README.md'),
    repo: 'contentauth/c2pa-android',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-ios-example/README.md'),
    repo: 'contentauth/c2pa-ios-example',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-android-example/README.md'),
    repo: 'contentauth/c2pa-android-example',
    path: 'README.md',
  },
];

function resolveMarkdownLinks(linkBase, content) {
  return content.replaceAll(mdLinkRegex, (match, label, href) => {
    let revisedUrl = href;
    if (!/^https?:\/\//.test(href)) {
      revisedUrl = url.resolve(linkBase, href);
    }
    return `[${label}](${revisedUrl})`;
  });
}

async function download() {
  for await (const { repo, path, dest, branch = 'main' } of readmes) {
    /*
     * Pass {branch} var to pull docs from other than main branch.
     */

    const src = `${RAW_GITHUB_HOST}/${repo}/${branch}/${path}`;
    const linkBase = `${GITHUB_HOST}/${repo}/blob/${branch}/${path}`;
    const res = await fetch(src);
    const markdown = await res.text();
    //const resolvedMarkdown = resolveMarkdownLinks(linkBase, markdown);
    //await writeFile(dest, resolvedMarkdown, { encoding: 'utf-8', flag: 'w+' });
    await writeFile(dest, markdown, { encoding: 'utf-8', flag: 'w+' });
    console.log('Saved %s to %s', src, dest);
  }
}

download();
