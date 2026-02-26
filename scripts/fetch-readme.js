const fetch = require('node-fetch');
const { resolve } = require('path');
const { writeFile } = require('fs/promises');
const url = require('url');

const GITHUB_HOST = 'https://github.com';
const RAW_GITHUB_HOST = 'https://raw.githubusercontent.com';

const mdLinkRegex =
  /\[([\w\s\d\-]+)\]\(((?:\/|https?:\/\/|\.)[\w\d\-./?=#]+)\)/g;

/*
 * Remote docs are defined in remote-docs.json at the project root.
 * After adding a new file to remote-docs.json, you must manually create the
 * directory and add an empty .gitkeep file to it so the build will work.
 * For example:
 *   $ cd opensource.contentauth.org/docs
 *   $ mkdir c2pa_service_example
 *   $ cd c2pa_service_example
 *   $ touch .gitkeep
 */

const remoteDocs = require('../remote-docs.json');
const readmes = remoteDocs.sources
  .filter((s) => s.dest)
  .map(({ repo, path, dest, branch = 'main' }) => ({
    repo,
    path,
    dest: resolve(__dirname, '..', dest),
    branch,
  }));

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
