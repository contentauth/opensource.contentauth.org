import React, { useEffect } from 'react';
import OriginalDocItemLayout from '@theme-original/DocItem/Layout';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { setEditThisPageUrl } from '@site/src/utils/editThisPageStore';

export default function DocItemLayout(props) {
  const { metadata } = useDoc();

  useEffect(() => {
    setEditThisPageUrl(metadata.editUrl);
    return () => setEditThisPageUrl(undefined);
  }, [metadata.editUrl]);

  return <OriginalDocItemLayout {...props} />;
}
