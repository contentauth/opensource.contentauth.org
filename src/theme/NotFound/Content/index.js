import React from 'react';
import OriginalNotFoundContent from '@theme-original/NotFound/Content';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import { usePluginData } from '@docusaurus/useGlobalData';
import { DocsSidebarProvider } from '@docusaurus/plugin-content-docs/client';
import DocRootLayout from '@theme/DocRoot/Layout';

// Same copy as the original NotFoundContent, but without its
// container/row/col--offset grid, which is meant for a full-width page and
// otherwise leaves a large empty gutter (and truncates text) next to the
// sidebar rendered by DocRootLayout below.
function NotFoundMessage({ className }) {
  return (
    <main className={className}>
      <Heading as="h1" className="hero__title">
        <Translate
          id="theme.NotFound.title"
          description="The title of the 404 page"
        >
          Page Not Found
        </Translate>
      </Heading>
      <p>
        <Translate
          id="theme.NotFound.p1"
          description="The first paragraph of the 404 page"
        >
          We could not find what you were looking for.
        </Translate>
      </p>
      <p>
        <Translate
          id="theme.NotFound.p2"
          description="The 2nd paragraph of the 404 page"
        >
          Please contact the owner of the site that linked you to the original
          URL and let them know their link is broken.
        </Translate>
      </p>
    </main>
  );
}

export default function NotFoundContent(props) {
  const { sidebar } = usePluginData('docs-404-sidebar-plugin') ?? {};

  if (!sidebar || sidebar.length === 0) {
    return <OriginalNotFoundContent {...props} />;
  }

  return (
    <DocsSidebarProvider name="docs" items={sidebar}>
      <DocRootLayout>
        <NotFoundMessage {...props} />
      </DocRootLayout>
    </DocsSidebarProvider>
  );
}
