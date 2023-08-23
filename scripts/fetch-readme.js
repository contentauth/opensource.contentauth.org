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
  {
    dest: resolve(__dirname, '../docs/rust-sdk/readme.md'),
    repo: 'contentauth/c2pa-rs',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/readme.md'),
    repo: 'contentauth/c2patool',
    path: 'README.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/manifest.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/manifest.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/x_509.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/x_509.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2patool/release-notes.md'),
    repo: 'contentauth/c2patool',
    path: 'docs/release-notes.md',
  },
  {
    dest: resolve(__dirname, '../docs/c2pa-service-example/readme.md'),
    repo: 'contentauth/c2pa-service-example',
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
    const resolvedMarkdown = resolveMarkdownLinks(linkBase, markdown);
    await writeFile(dest, resolvedMarkdown, { encoding: 'utf-8', flag: 'w+' });
    console.log('Saved %s to %s', src, dest);
  }
}

download();
