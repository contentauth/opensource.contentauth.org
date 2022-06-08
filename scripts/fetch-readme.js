const fetch = require('node-fetch');
const { resolve } = require('path');
const { writeFile } = require('fs/promises');
const url = require('url');

const GITHUB_HOST = 'https://github.com';
const RAW_GITHUB_HOST = 'https://raw.githubusercontent.com';

const mdLinkRegex =
  /\[([\w\s\d\-]+)\]\(((?:\/|https?:\/\/|\.)[\w\d\-./?=#]+)\)/g;

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
  for await (const { repo, path, dest } of readmes) {
    const src = `${RAW_GITHUB_HOST}/${repo}/main/${path}`;
    const linkBase = `${GITHUB_HOST}/${repo}/blob/main/${path}`;
    const res = await fetch(src);
    const markdown = await res.text();
    const resolvedMarkdown = resolveMarkdownLinks(linkBase, markdown);
    await writeFile(dest, resolvedMarkdown, { encoding: 'utf-8', flag: 'w+' });
    console.log('Saved %s to %s', src, dest);
  }
}

download();
