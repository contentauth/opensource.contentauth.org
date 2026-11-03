const assert = require('node:assert/strict');
const { test } = require('node:test');
const { resolveMarkdownLinks } = require('./fetch-readme');

const source = { repo: 'adobe/trustmark', path: 'rust/README.md' };
const base = 'https://github.com/adobe/trustmark/blob/main/';

test('resolves TrustMark destinations relative to their source files', async () => {
  const cases = [
    ['RELEASING.md', `${base}rust/RELEASING.md`],
    [
      '../.github/workflows/rust-ci.yml',
      `${base}.github/workflows/rust-ci.yml`,
    ],
    ['../README.md#data-schema', `${base}README.md#data-schema`],
    ['./CHANGELOG.md', `${base}rust/CHANGELOG.md`],
    ['/LICENSE', `${base}LICENSE`],
  ];
  for (const [href, expected] of cases) {
    assert.equal(
      await resolveMarkdownLinks(source, `[label](${href})`),
      `[label](${expected})`,
    );
  }
  assert.equal(
    await resolveMarkdownLinks(
      { ...source, path: 'rust/crates/trustmark-cli/README.md' },
      '[models](../../README.md#download-models)',
    ),
    `[models](${base}rust/README.md#download-models)`,
  );
});

test('uses the configured branch', async () => {
  assert.equal(
    await resolveMarkdownLinks(
      { ...source, branch: 'docs-fix' },
      '[release](RELEASING.md)',
    ),
    '[release](https://github.com/adobe/trustmark/blob/docs-fix/rust/RELEASING.md)',
  );
});

test('preserves labels, titles, references, whitespace, and line endings', async () => {
  const input =
    '[**Rust** and `CLI`](../README.md#models "Model guide")\r\n\r\n' +
    "[reference][config]\r\n\r\n[config]: <../python/CONFIG.md> 'Settings'\r\n";
  const expected = input
    .replace('../README.md#models', `${base}README.md#models`)
    .replace('../python/CONFIG.md', `${base}python/CONFIG.md`);
  assert.equal(await resolveMarkdownLinks(source, input), expected);
});

test('handles escaped destinations, parentheses, entities, and spaces', async () => {
  assert.equal(
    await resolveMarkdownLinks(
      source,
      '[file](file\\(v1\\).md?raw=1&amp;mode=2) [space](<a b.md>)',
    ),
    `[file](${base}rust/file\\(v1\\).md?raw=1&amp;mode=2) [space](<${base}rust/a%20b.md>)`,
  );
});

test('preserves fragment-only, absolute, protocol-relative, and empty links', async () => {
  const input = [
    '[local](#model-loading)',
    '[web](https://example.com/a)',
    '[http](http://example.com/a)',
    '[cdn](//example.com/a)',
    '[email](mailto:docs@example.com)',
    '[data](data:text/plain,hello)',
    '[empty]()',
  ].join('\n');
  assert.equal(await resolveMarkdownLinks(source, input), input);
});

test('does not rewrite Markdown examples inside code', async () => {
  const input =
    '`[inline](README.md)`\n\n```md\n[example](README.md)\n```\n\n' +
    '    [indented](README.md)\n\n[real](README.md)';
  assert.equal(
    await resolveMarkdownLinks(source, input),
    input.replace('[real](README.md)', `[real](${base}rust/README.md)`),
  );
});

test('leaves other repositories unchanged', async () => {
  const input = '[config](python/CONFIG.md) [local](#heading)';
  assert.equal(
    await resolveMarkdownLinks(
      { repo: 'contentauth/c2pa-android', path: 'README.md' },
      input,
    ),
    input,
  );
});

test('rewriting is idempotent', async () => {
  const input = '[release](RELEASING.md)';
  const rewritten = await resolveMarkdownLinks(source, input);
  assert.equal(await resolveMarkdownLinks(source, rewritten), rewritten);
});
