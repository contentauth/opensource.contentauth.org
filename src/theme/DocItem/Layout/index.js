import React, { useEffect } from 'react';
import OriginalDocItemLayout from '@theme-original/DocItem/Layout';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import { setEditThisPageUrl } from '@site/src/utils/editThisPageStore';

export default function DocItemLayout(props) {
  const { metadata, frontMatter } = useDoc();
  const { i18n } = useDocusaurusContext();
  const isEnglishFallback =
    i18n.currentLocale !== i18n.defaultLocale &&
    !metadata.source.startsWith(`@site/i18n/${i18n.currentLocale}/`);
  const isDraftTranslation = frontMatter.translation_status === 'draft';

  useEffect(() => {
    setEditThisPageUrl(metadata.editUrl);
    return () => setEditThisPageUrl(undefined);
  }, [metadata.editUrl]);

  return (
    <>
      {(isEnglishFallback || isDraftTranslation) && (
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
      )}
      {isEnglishFallback && (
        <div className="alert alert--info margin-bottom--md">
          <Translate id="site.i18n.englishFallback">
            This page is not yet translated. Its content is available in
            English.
          </Translate>
        </div>
      )}
      {isDraftTranslation && (
        <div className="alert alert--warning margin-bottom--md">
          <Translate id="site.i18n.draftTranslation">
            This translation is a draft awaiting human review.
          </Translate>
        </div>
      )}
      <OriginalDocItemLayout {...props} />
    </>
  );
}
