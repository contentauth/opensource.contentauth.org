import React from 'react';
import OriginalNotFoundContent from '@theme-original/NotFound/Content';
import { usePluginData } from '@docusaurus/useGlobalData';
import { DocsSidebarProvider } from '@docusaurus/plugin-content-docs/client';
import DocRootLayout from '@theme/DocRoot/Layout';

export default function NotFoundContent(props) {
  const { sidebar } = usePluginData('docs-404-sidebar-plugin') ?? {};

  if (!sidebar || sidebar.length === 0) {
    return <OriginalNotFoundContent {...props} />;
  }

  return (
    <DocsSidebarProvider name="docs" items={sidebar}>
      <DocRootLayout>
        <OriginalNotFoundContent {...props} />
      </DocRootLayout>
    </DocsSidebarProvider>
  );
}
