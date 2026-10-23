const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync, readdirSync, existsSync } = require('node:fs');
const { resolve, relative, sep } = require('node:path');
const {
  parseMarkdownFile,
  DEFAULT_PARSE_FRONT_MATTER,
} = require('@docusaurus/utils');

const siteDir = resolve(__dirname, '..');
const pilotDocs = [
  'introduction.mdx',
  'getting-started/index.mdx',
  'getting-started/faqs.mdx',
  'getting-started/glossary.mdx',
];

function sourceHash(content) {
  return createHash('sha256').update(content).digest('hex');
}

function getTranslationIssue(frontMatter, content) {
  if (frontMatter.translation_source_hash !== sourceHash(content)) {
    return 'missing or stale English source hash';
  }
  if (!['draft', 'reviewed'].includes(frontMatter.translation_status)) {
    return 'translation_status must be draft or reviewed';
  }
  return undefined;
}

function markdownFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      return markdownFiles(path);
    }
    return entry.isFile() && /\.(md|mdx)$/.test(entry.name) ? [path] : [];
  });
}

async function checkTranslations() {
  const config = await require('../docusaurus.config');
  const requireComplete = process.argv.includes('--require-complete');
  let failures = 0;
  for (const locale of config.i18n.locales) {
    if (locale === config.i18n.defaultLocale) {
      continue;
    }
    const directory = resolve(
      siteDir,
      'i18n',
      locale,
      'docusaurus-plugin-content-docs',
      'current',
    );
    for (const docPath of pilotDocs) {
      if (!existsSync(resolve(directory, docPath))) {
        console.log(`${locale}: missing pilot translation: ${docPath}`);
        if (requireComplete) {
          failures += 1;
        }
      }
    }
    for (const filePath of markdownFiles(directory)) {
      const docPath = relative(directory, filePath);
      const englishPath = resolve(siteDir, 'docs', docPath);
      assert.ok(englishPath.startsWith(`${resolve(siteDir, 'docs')}${sep}`));
      const { frontMatter } = await parseMarkdownFile({
        filePath,
        fileContent: readFileSync(filePath, 'utf8'),
        parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
      });
      const issue = existsSync(englishPath)
        ? getTranslationIssue(frontMatter, readFileSync(englishPath))
        : 'English source does not exist';
      if (issue) {
        console.error(`${locale}: ${docPath}: ${issue}`);
        failures += 1;
      } else {
        console.log(`${locale}: ${docPath}: ${frontMatter.translation_status}`);
        if (requireComplete && frontMatter.translation_status !== 'reviewed') {
          failures += 1;
        }
      }
    }
  }
  if (failures > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  checkTranslations().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { sourceHash, getTranslationIssue };
