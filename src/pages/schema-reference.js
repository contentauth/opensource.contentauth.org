import React from 'react';
import { useLocation } from '@docusaurus/router';
import SchemaReference from '../components/SchemaReference';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SchemaReferencePage() {
  const query = useQuery();
  const file = query.get('file');

  if (!file) {
    return <div>ERROR: No schema file specified.</div>;
  }

  const schemaUrl = `/schemas/${file}`;
  return (
    <div>
      <SchemaReference schemaUrl={schemaUrl} />
    </div>
  );
}
