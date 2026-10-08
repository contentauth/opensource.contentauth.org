import React from 'react';
import OriginalDocItemContent from '@theme-original/DocItem/Content';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DocItemContent(props) {
  const { metadata } = useDoc();
  const { i18n } = useDocusaurusContext();
  const isLocalized = metadata.source.startsWith(
    `@site/i18n/${i18n.currentLocale}/`,
  );

  return (
    <div lang={isLocalized ? i18n.currentLocale : i18n.defaultLocale}>
      <OriginalDocItemContent {...props} />
    </div>
  );
}
