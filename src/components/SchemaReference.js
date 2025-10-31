import React, { useEffect, useMemo, useState } from 'react';

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

function formatType(cellSchema) {
  if (!cellSchema) return 'N/A';

  // $ref
  if (cellSchema.$ref) {
    const ref = cellSchema.$ref;
    const name = ref.startsWith('#/$defs/') ? ref.replace('#/$defs/', '') : ref;
    return `<a href="#${slugify(name)}">${name}</a>`;
  }

  // enum
  if (Array.isArray(cellSchema.enum)) {
    return `Enum (${cellSchema.enum.join(', ')})`;
  }

  // oneOf / anyOf
  if (Array.isArray(cellSchema.oneOf) || Array.isArray(cellSchema.anyOf)) {
    const list = (cellSchema.oneOf || cellSchema.anyOf).map((s) =>
      formatType(s),
    );
    return `Either ${list.join(' or ')}`;
  }

  // array
  if (cellSchema.type === 'array' || isObject(cellSchema.items)) {
    if (cellSchema.items) {
      const inner = formatType(cellSchema.items);
      return `Array of ${inner}`;
    }
    return 'Array';
  }

  // primitive or union of primitives
  if (Array.isArray(cellSchema.type)) {
    const types = cellSchema.type
      .filter((t) => t !== 'null')
      .map((t) => (typeof t === 'string' ? t : String(t)));
    return types.map(capitalizeType).join(' or ');
  }

  if (typeof cellSchema.type === 'string') {
    if (cellSchema.type === 'object') return 'Object';
    return capitalizeType(cellSchema.type);
  }

  return 'N/A';
}

function capitalizeType(t) {
  if (!t) return '';
  switch (t) {
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    case 'integer':
      return 'Integer';
    case 'boolean':
      return 'Boolean';
    case 'object':
      return 'Object';
    case 'array':
      return 'Array';
    default:
      return String(t).charAt(0).toUpperCase() + String(t).slice(1);
  }
}

function HTML({ html }) {
  // Safe enough for our constrained formatting output
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function markdownToHtml(text) {
  if (!text) return '';
  let html = String(text);

  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // Remove fenced code blocks delimited by triple backticks (```), with optional language
  html = html.replace(/```[^\n]*\n[\s\S]*?```/g, '');

  // Remove reference-style link definition blocks that follow a blank line
  // e.g. "\n\n[`Builder`]: crate::Builder" or "\n\n[label]: https://..."
  html = html.replace(/(?:\r?\n){2}(?:\s*\[[^\]]+\]:[^\n]*\r?\n?)+/g, '');

  // Also remove any remaining single-line reference definitions
  html = html.replace(/^\s*\[[^\]]+\]:\s*[^\n]+$/gm, '');

  // Resolve Rust doc-style code references like [`Type`] or [`Type::member`]
  const TYPE_MODULE_HINTS = {
    Verify: 'settings',
    MerkleMap: 'assertions',
    BmffHash: 'assertions',
    Builder: '',
  };
  const resolveDocsUrl = (codeRef) => {
    let refStr = codeRef.replace(/^crate::/, '');

    const parts = refStr.split('::');
    let moduleParts = [];
    let typeName = '';
    let member = '';

    if (parts.length === 1) {
      // Single type name; use hints for module placement, default to crate root
      typeName = parts[0];
      const hinted = TYPE_MODULE_HINTS[typeName];
      if (hinted) {
        moduleParts = hinted ? [hinted] : [];
      } else {
        moduleParts = [];
      }
    } else if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      const prev = parts[parts.length - 2];
      const isLastType = /^[A-Z]/.test(last);
      if (isLastType) {
        typeName = last;
        moduleParts = parts.slice(0, parts.length - 1);
      } else {
        member = last;
        typeName = prev;
        moduleParts = parts.slice(0, parts.length - 2);
      }
    }

    if (moduleParts.length === 0 && typeName) {
      const hinted = TYPE_MODULE_HINTS[typeName];
      if (hinted !== undefined) moduleParts = hinted ? [hinted] : [];
    }

    const modulePath = moduleParts.length ? moduleParts.join('/') + '/' : '';
    let url = `https://docs.rs/c2pa/latest/c2pa/${modulePath}struct.${typeName}.html`;

    if (member) {
      const anchor = /_/.test(member)
        ? `structfield.${member}`
        : `method.${member}`;
      url += `#${anchor}`;
    }
    return url;
  };

  // Convert [`CodeRef`] to links to docs.rs, preserving code formatting
  html = html.replace(/\[`([^`]+)`\]/g, (m, codeRef) => {
    const url = resolveDocsUrl(codeRef);
    return `<a href="${escapeHtml(url)}"><code>${escapeHtml(
      codeRef,
    )}</code></a>`;
  });

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const safeUrl = url.replace(/"/g, '&quot;');
    return `<a href="${safeUrl}">${label}</a>`;
  });

  // Autolinks: <https://example.com>
  html = html.replace(/<((?:https?:\/\/|mailto:)[^>]+)>/g, (m, url) => {
    const safeUrl = url.replace(/"/g, '&quot;');
    return `<a href="${safeUrl}">${url}</a>`;
  });

  // Bold and italics
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Remove reference-style link definitions (already inlined)
  html = html.replace(/^\s*\[`[^`]+`\]:\s*[^\n]+$/gm, '');

  // Paragraphs: split on double newlines, single newline -> <br/>
  const parts = html
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br />')}</p>`);
  return parts.join('');
}

function Markdown({ text }) {
  return <span dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />;
}

function PropertiesTable({ title, description, properties, required }) {
  if (!properties || Object.keys(properties).length === 0) return null;

  return (
    <>
      {title ? (
        <h3 className="scroll-target" id={slugify(title)}>
          {title}
        </h3>
      ) : null}

      {description ? (
        <div className="prop_desc">
          <Markdown text={description} />
        </div>
      ) : null}

      <table
        className="manifest-ref-table"
        style={{ marginTop: title ? 10 : 0 }}
      >
        <thead>
          <tr>
            <th className="manifest-ref-table">Property</th>
            <th className="manifest-ref-table">Type</th>
            <th className="manifest-ref-table">Description</th>
            <th className="manifest-ref-table">Required?</th>
            <th className="manifest-ref-table">Default Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(properties).map(([name, schema]) => {
            const typeHtml = formatType(schema);
            const isRequired = Array.isArray(required)
              ? required.includes(name)
              : false;
            const defaultValue =
              schema && Object.prototype.hasOwnProperty.call(schema, 'default')
                ? JSON.stringify(schema.default)
                : 'N/A';

            return (
              <tr key={name}>
                <td className="manifest-ref-table">{name}</td>
                <td className="manifest-ref-table">
                  <HTML html={typeHtml} />
                </td>
                <td className="manifest-ref-table">
                  {schema && schema.description ? (
                    <div className="prop_desc">
                      <Markdown text={schema.description} />
                    </div>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td className="manifest-ref-table">
                  {isRequired ? 'YES' : 'NO'}
                </td>
                <td className="manifest-ref-table">{defaultValue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function DefinitionsTOC({ defs }) {
  const names = useMemo(
    () =>
      Object.keys(defs || {}).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
      ),
    [defs],
  );
  if (names.length === 0) return null;

  const colCount = 4;
  const perCol = Math.ceil(names.length / colCount);
  const cols = Array.from({ length: colCount }, (_, idx) =>
    names.slice(idx * perCol, (idx + 1) * perCol),
  );

  return (
    <>
      <h2 className="scroll-target" id="definitions">
        Definitions
      </h2>
      <table style={{ border: 0 }} width="900">
        <tbody>
          <tr>
            {cols.map((col, i) => (
              <td key={i} style={{ border: 0, verticalAlign: 'top' }}>
                {col.map((n) => (
                  <div key={n}>
                    <a href={`#${slugify(n)}`}>{n}</a> <br />
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

function getUnionOptions(schema) {
  if (!schema) return [];
  const union = Array.isArray(schema.oneOf)
    ? schema.oneOf
    : Array.isArray(schema.anyOf)
    ? schema.anyOf
    : null;
  if (!Array.isArray(union)) return [];
  return union.filter((opt) => opt && typeof opt === 'object');
}

function UnionOptionsTable({ options }) {
  if (!options || options.length === 0) return null;

  const getTypeLabel = (opt) => {
    if (!opt) return 'N/A';
    if (typeof opt.type === 'string') return capitalizeType(opt.type);
    if (Array.isArray(opt.type))
      return opt.type.map(capitalizeType).join(' or ');
    if (opt.$ref) {
      const name = opt.$ref.startsWith('#/$defs/')
        ? opt.$ref.replace('#/$defs/', '')
        : opt.$ref;
      return name;
    }
    return 'N/A';
  };

  return (
    <table className="manifest-ref-table" style={{ marginTop: 10 }}>
      <thead>
        <tr>
          <th className="manifest-ref-table">Type</th>
          <th className="manifest-ref-table">Description</th>
          <th className="manifest-ref-table">Value</th>
        </tr>
      </thead>
      <tbody>
        {options.map((opt, idx) => (
          <tr key={idx}>
            <td className="manifest-ref-table">{getTypeLabel(opt)}</td>
            <td className="manifest-ref-table">
              {opt.description ? (
                <div className="prop_desc">
                  <Markdown text={opt.description} />
                </div>
              ) : (
                'N/A'
              )}
            </td>
            <td className="manifest-ref-table">
              {Object.prototype.hasOwnProperty.call(opt, 'const')
                ? String(opt.const)
                : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DefinitionSection({ name, schema }) {
  const titleId = slugify(name);
  const isObjectType =
    (schema && schema.type === 'object') ||
    (schema && isObject(schema.properties));
  const unionOptions = getUnionOptions(schema);

  return (
    <>
      <h3 className="scroll-target" id={titleId}>
        {name}
      </h3>
      <p>{/* anchor spacing / end of oneOf entity */}</p>
      {schema && schema.description ? (
        <div className="prop_desc">
          <Markdown text={schema.description} />
        </div>
      ) : null}

      {unionOptions.length > 0 ? (
        <UnionOptionsTable options={unionOptions} />
      ) : isObjectType ? (
        <PropertiesTable
          properties={schema.properties || {}}
          required={schema.required || []}
        />
      ) : (
        // Fallback simple table for non-object schemas
        <table className="manifest-ref-table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th className="manifest-ref-table">Property</th>
              <th className="manifest-ref-table">Type</th>
              <th className="manifest-ref-table">Description</th>
              <th className="manifest-ref-table">Required?</th>
              <th className="manifest-ref-table">Default Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="manifest-ref-table">type</td>
              <td className="manifest-ref-table">
                <HTML html={formatType(schema)} />
              </td>
              <td className="manifest-ref-table">
                {schema && schema.description ? (
                  <div className="prop_desc">
                    <Markdown text={schema.description} />
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="manifest-ref-table">NO</td>
              <td className="manifest-ref-table">N/A</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default function SchemaReference({ schemaUrl }) {
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(schemaUrl);
        if (!res.ok) throw new Error(`Failed to fetch schema: ${schemaUrl}`);
        const json = await res.json();
        if (!cancelled) setSchema(json);
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [schemaUrl]);

  if (loading) return <p>Loading schema…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!schema) return <p>No schema loaded.</p>;

  const defs = schema.$defs || schema.definitions || {};
  const title = schema.title || 'Schema';
  const titleId = slugify(title);

  return (
    <div>
      <h2 className="scroll-target" id={titleId}>
        {title}
      </h2>
      {schema.description ? (
        <div className="prop_desc">
          <Markdown text={schema.description} />
        </div>
      ) : null}

      <h3 className="scroll-target" id="properties">
        Properties
      </h3>
      <PropertiesTable
        properties={schema.properties || {}}
        required={schema.required || []}
      />

      <DefinitionsTOC defs={defs} />

      {Object.entries(defs).map(([name, defSchema]) => (
        <DefinitionSection key={name} name={name} schema={defSchema} />
      ))}
    </div>
  );
}
