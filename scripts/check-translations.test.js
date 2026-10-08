const assert = require('node:assert/strict');
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
