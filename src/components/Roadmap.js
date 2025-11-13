import React, { useEffect, useMemo, useState } from 'react';

// Default order and headings to mirror docs/includes/_roadmap.md
const STATUS_SECTIONS = [
  {
    key: 'Released',
    heading: 'Released',
    description: 'The work has been released.',
  },
  {
    key: 'Merged to Main',
    heading: 'Merged to Main',
    description:
      'Code has been merged to the main branch but not yet released.  This is the final step before releasing the feature or fix.',
  },
  {
    key: 'Code Complete',
    heading: 'Code Complete',
    description:
      'Coding is done, but testing may still be in progress, and the code has not been merged to the main branch. After testing is complete, the code is merged to the main branch.',
  },
  {
    key: 'In Progress',
    heading: 'In Progress',
    description: 'Work is in progress.',
  },
  { key: 'Todo', heading: 'Todo', description: 'Planned for future work.' },
  {
    key: 'In Review / Triage',
    heading: 'In Review / Triage',
    description:
      'Task is under review to determine if and when it can be addressed.',
  },
];

function parseTsv(tsvText) {
  if (!tsvText) return [];
  const lines = tsvText
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  const header = lines[0].split('\t').map((h) => h.trim());
  const colIndex = {
    title: header.findIndex((h) => /^title$/i.test(h)),
    url: header.findIndex((h) => /^url$/i.test(h)),
    assignees: header.findIndex((h) => /^assignees$/i.test(h)),
    status: header.findIndex((h) => /^status$/i.test(h)),
  };

  return lines.slice(1).map((line) => {
    const cols = line.split('\t');
    const get = (idx) =>
      idx >= 0 && idx < cols.length ? cols[idx].trim() : '';
    return {
      title: get(colIndex.title),
      url: get(colIndex.url),
      assignees: get(colIndex.assignees),
      status: get(colIndex.status),
    };
  });
}

function extractRepositoryFromUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    // Expect: /contentauth/<repo>/...
    if (parts.length >= 2) {
      return parts[1]; // <repo>
    }
    return '';
  } catch {
    return '';
  }
}

function groupByStatus(items) {
  return items.reduce((acc, item) => {
    const key =
      item.status && item.status.length ? item.status : 'Uncategorized';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function Roadmap({ src = '/project-roadmap/roadmap.tsv' }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(src);
        if (!res.ok) {
          throw new Error(`Failed to fetch TSV from ${src} (${res.status})`);
        }
        const text = await res.text();
        if (cancelled) return;
        const parsed = parseTsv(text).map((r) => ({
          ...r,
          repository: extractRepositoryFromUrl(r.url),
        }));
        setRows(parsed);
      } catch (e) {
        setError(e.message || String(e));
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const grouped = useMemo(() => groupByStatus(rows), [rows]);

  if (loading) {
    return <p>Loading roadmap…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!rows.length) {
    return <p>No roadmap items found.</p>;
  }

  return (
    <div>
      {STATUS_SECTIONS.map((section) => {
        const items = grouped[section.key] || [];
        const isOpen = !!expanded[section.key];
        const sectionId = section.key.toLowerCase().replace(/\s+/g, '-');
        const contentId = `${sectionId}-content`;
        return (
          <div key={section.key} style={{ marginBottom: '32px' }}>
            <h3 id={sectionId} style={{ marginBottom: '8px' }}>
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [section.key]: !prev[section.key],
                  }))
                }
                aria-expanded={isOpen}
                aria-controls={contentId}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ display: 'inline-block', width: '1em' }}
                >
                  {isOpen ? '▾' : '▸'}
                </span>
                <span>{section.heading}</span>
                <span style={{ color: '#666', fontWeight: 400 }}>
                  ({items.length})
                </span>
              </button>
            </h3>
            {isOpen ? (
              <div id={contentId}>
                <p>{section.description}</p>
                {items.length === 0 ? (
                  section.key === 'Merged to Main' ? (
                    <p>
                      <em>There are currently no items with this status.</em>
                    </p>
                  ) : null
                ) : (
                  <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: 'left',
                            borderBottom: '1px solid #ddd',
                            padding: '8px',
                          }}
                        >
                          Task
                        </th>
                        <th
                          style={{
                            textAlign: 'left',
                            borderBottom: '1px solid #ddd',
                            padding: '8px',
                            width: '200px',
                          }}
                        >
                          Repository
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const titleCell =
                          item.url && item.url.length ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.title || '(untitled)'}
                            </a>
                          ) : (
                            item.title || '(untitled)'
                          );
                        return (
                          <tr key={`${section.key}-${idx}`}>
                            <td
                              style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px',
                              }}
                            >
                              {titleCell}
                            </td>
                            <td
                              style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px',
                              }}
                            >
                              {item.repository || ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
