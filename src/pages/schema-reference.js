import React from 'react';
import { useLocation } from '@docusaurus/router';
import SchemaReference from '../components/SchemaReference';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const AVAILABLE_SCHEMAS = [
  'Reader.schema.json',
  'Builder.schema.json',
  'ManifestDefinition.schema.json',
  'Settings.schema.json',
];

export default function SchemaReferencePage() {
  const query = useQuery();
  const file = query.get('file');

  if (!file) {
    return (
      <div>
        <h1>Schema Reference</h1>
        <p>Select a schema to view its reference documentation:</p>
        <ul>
          {AVAILABLE_SCHEMAS.map((f) => (
            <li key={f}>
              <a href={`./schema-reference?file=${encodeURIComponent(f)}`}>
                {f.replace('.schema.json', '')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const schemaUrl = `/schemas/${file}`;
  return (
    <div>
      <SchemaReference schemaUrl={schemaUrl} />
    </div>
  );
}
