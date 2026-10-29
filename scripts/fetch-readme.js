const fetch = require('node-fetch');
const { resolve } = require('path');
const { writeFile } = require('fs/promises');

const GITHUB_HOST = 'https://github.com';
const RAW_GITHUB_HOST = 'https://raw.githubusercontent.com';

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

async function resolveMarkdownLinks({ repo, path, branch = 'main' }, content) {
  if (repo !== 'adobe/trustmark') {
    return content;
  }

  const [{ parse, postprocess, preprocess }, { decodeString }] =
    await Promise.all([
      import('micromark'),
      import('micromark-util-decode-string'),
    ]);
  const repoBase = `${GITHUB_HOST}/${repo}/blob/${encodeURIComponent(branch)}/`;
  const linkBase = new URL(path, repoBase);
  const events = postprocess(
    parse().document().write(preprocess()(content, 'utf8', true)),
  );
  const replacements = [];

  for (const [event, token] of events) {
    if (
      event !== 'exit' ||
      !['resourceDestinationString', 'definitionDestinationString'].includes(
        token.type,
      )
    ) {
      continue;
    }

    const start = token.start.offset;
    const end = token.end.offset;
    const href = decodeString(content.slice(start, end));
    if (!href || /^(?:#|\/\/|[a-z][a-z\d+.-]*:)/i.test(href)) {
      continue;
    }

    const resolved = href.startsWith('/')
      ? new URL(href.slice(1), repoBase)
      : new URL(href, linkBase);
    replacements.push({
      start,
      end,
      href: resolved.href.replace(/&/g, '&amp;').replace(/[()]/g, '\\$&'),
    });
  }

  // Apply edits backwards so Markdown formatting and source offsets stay intact.
  for (const { start, end, href } of replacements.reverse()) {
    content = content.slice(0, start) + href + content.slice(end);
  }
  return content;
}

async function download(sources = readmes) {
  for (const source of sources) {
    const { repo, path, dest, branch = 'main' } = source;
    /*
     * Pass {branch} var to pull docs from other than main branch.
     */

    const src = `${RAW_GITHUB_HOST}/${repo}/${branch}/${path}`;
    const res = await fetch(src);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${src}: ${res.status} ${res.statusText}`,
      );
    }
    const markdown = await res.text();
    const resolvedMarkdown = await resolveMarkdownLinks(source, markdown);
    await writeFile(dest, resolvedMarkdown, { encoding: 'utf-8', flag: 'w+' });
    console.log('Saved %s to %s', src, dest);
  }
}

if (require.main === module) {
  download().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { download, readmes, resolveMarkdownLinks };
