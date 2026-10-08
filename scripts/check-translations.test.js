const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
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
