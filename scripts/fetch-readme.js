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
  // c2patool
  {
    dest: resolve(__dirname, '../docs/c2patool/readme.md'),
    repo: 'contentauth/c2patool',
    path: 'README.md',
    branch: 'crandmck/update-contributing',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/usage.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/usage.md',
    branch: 'crandmck/update-contributing',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/manifest.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/manifest.md',
    branch: 'crandmck/update-contributing',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/x_509.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/x_509.md',
    branch: 'crandmck/update-contributing',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/docs/release-notes.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/release-notes.md',
    branch: 'crandmck/update-contributing',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-service-example/readme.md'),
    repo: 'contentauth/c2pa-service-example',
    path: 'README.md',
  },
  // Node.js lib
  {
    dest: resolve(__dirname, '../docs/c2pa-node/readme.md'),
    repo: 'contentauth/c2pa-node',
    path: 'README.md',
    branch: 'crandmck/docs-overhaul',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-node/docs/usage.md'),
    repo: 'contentauth/c2pa-node',
    path: 'docs/usage.md',
    branch: 'crandmck/docs-overhaul',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-node/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-node/docs/release-notes.md'),
    repo: 'contentauth/c2pa-node',
    path: 'docs/release-notes.md',
    branch: 'crandmck/docs-overhaul',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-node-example/readme.md'),
    repo: 'contentauth/c2pa-node-example',
    path: 'README.md',
  },
  // Python lib
  {
    dest: resolve(__dirname, '../docs/c2pa-python/readme.md'),
    repo: 'contentauth/c2pa-python',
    path: 'README.md',
    branch: 'docs/add-rns-and-reorg',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/usage.md'),
    repo: 'contentauth/c2pa-python',
    path: 'docs/usage.md',
    branch: 'docs/add-rns-and-reorg',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-python/docs/release-notes.md'),
    repo: 'contentauth/c2pa-python',
    path: 'docs/release-notes.md',
    branch: 'docs/add-rns-and-reorg',
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
    branch: 'crandmck/docs-overhaul',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-c/docs/usage.md'),
    repo: 'contentauth/c2pa-c',
    path: 'docs/usage.md',
    branch: 'crandmck/docs-overhaul',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-c/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
    branch: 'crandmck/reorg-docs',
  },
  // Rust lib
  {
    dest: resolve(__dirname, '../docs/rust-sdk/readme.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'README.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/supported-formats.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/supported-formats.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/usage.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/usage.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/rust-sdk/docs/release-notes.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'docs/release-notes.md',
    branch: 'crandmck/reorg-docs',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-min/readme.md'),
    repo: 'contentauth/c2pa-min',
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
