const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const {
  createSlugger,
  resolveMarkdownLinkPathname,
} = require('@docusaurus/utils');
const { sourceHash, getTranslationIssue } = require('./check-translations');

test('accepts current reviewed and draft translations', () => {
  for (const status of ['draft', 'reviewed']) {
    assert.equal(
      getTranslationIssue(
        {
          translation_source_hash: sourceHash('English source'),
          translation_status: status,
        },
        'English source',
      ),
      undefined,
    );
  }
});

test('localized Glossaries preserve every entry anchor and resolve source links', () => {
  const root = path.join(__dirname, '..');
  const source = readFileSync(
    path.join(root, 'docs/getting-started/glossary.mdx'),
    'utf8',
  );
  const slugger = createSlugger();
  const anchors = [...source.matchAll(/^#### (.+)$/gm)].map((match) =>
    slugger.slug(match[1]),
  );
  const linkTargets = (text) =>
    [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
  const normalizeTarget = (target) =>
    /\.mdx?(?:#|$)/.test(target) && !target.startsWith('https://')
      ? path.posix.resolve('/getting-started', target)
      : target;
  const sourceToPermalink = new Map(
    linkTargets(source)
      .filter((target) => /\.mdx?(?:#|$)/.test(target))
      .map((target) => {
        const normalized = normalizeTarget(target).split('#')[0];
        return [`@site/docs${normalized}`, normalized];
      }),
  );
  assert(anchors.length > 0, 'English Glossary must define entries');
  for (const locale of ['fr', 'it', 'de', 'es']) {
    const document = readFileSync(
      path.join(
        root,
        'i18n',
        locale,
        'docusaurus-plugin-content-docs/current/getting-started/glossary.mdx',
      ),
      'utf8',
    );
    const headings = [...document.matchAll(/^#### (.+)$/gm)];
    const translatedAnchors = headings.map(
      (match) => match[1].match(/\{#([^}]+)\}$/)?.[1],
    );
    assert.deepEqual(translatedAnchors, anchors, `${locale}: entry anchors`);
    assert.equal(new Set(translatedAnchors).size, anchors.length);
    assert.deepEqual(
      linkTargets(document).map(normalizeTarget),
      linkTargets(source).map(normalizeTarget),
      `${locale}: link targets`,
    );
    for (const target of linkTargets(document).filter((target) =>
      /\.mdx?(?:#|$)/.test(target),
    )) {
      const pathname = target.split('#')[0];
      assert.equal(
        resolveMarkdownLinkPathname(pathname, {
          siteDir: root,
          sourceFilePath: path.join(
            root,
            'i18n',
            locale,
            'docusaurus-plugin-content-docs/current/getting-started/glossary.mdx',
          ),
          contentPaths: {
            contentPath: path.join(root, 'docs'),
            contentPathLocalized: path.join(
              root,
              'i18n',
              locale,
              'docusaurus-plugin-content-docs/current',
            ),
          },
          sourceToPermalink,
        }),
        normalizeTarget(pathname),
        `${locale}: unresolved ${target}`,
      );
    }
    for (const target of linkTargets(document).filter((target) =>
      target.startsWith('#'),
    )) {
      assert(
        translatedAnchors.includes(target.slice(1)),
        `${locale}: missing ${target}`,
      );
    }
  }
});

test('detects changed English content without editing source files', () => {
  assert.equal(
    getTranslationIssue(
      {
        translation_source_hash: sourceHash('Original English'),
        translation_status: 'reviewed',
      },
      'Updated English',
    ),
    'missing or stale English source hash',
  );
});

test('rejects translations without a source hash or review state', () => {
  assert.equal(
    getTranslationIssue({}, 'English'),
    'missing or stale English source hash',
  );
  assert.equal(
    getTranslationIssue(
      { translation_source_hash: sourceHash('English') },
      'English',
    ),
    'translation_status must be draft or reviewed',
  );
});

test('localized Introduction diagrams have a translation for every label', () => {
  const root = path.join(__dirname, '..');
  const component = readFileSync(
    path.join(root, 'src/components/SdkOverview/index.js'),
    'utf8',
  );
  const ids = new Set(
    [...component.matchAll(/site\.sdkOverview\.\w+/g)].map((match) => match[0]),
  );
  assert(ids.size > 0, 'diagram must declare translation IDs');
  for (const locale of ['fr', 'it', 'de', 'es']) {
    const catalog = JSON.parse(
      readFileSync(path.join(root, 'i18n', locale, 'code.json'), 'utf8'),
    );
    for (const id of ids) {
      assert.equal(typeof catalog[id]?.message, 'string', `${locale}: ${id}`);
      assert(catalog[id].message.trim(), `${locale}: empty ${id}`);
    }
    const document = readFileSync(
      path.join(
        root,
        'i18n',
        locale,
        'docusaurus-plugin-content-docs/current/introduction.mdx',
      ),
      'utf8',
    );
    assert(document.includes('<SdkOverview />'), `${locale}: missing diagram`);
    assert(
      !document.includes('cai-open-source.jpg'),
      `${locale}: English raster`,
    );
  }
});
