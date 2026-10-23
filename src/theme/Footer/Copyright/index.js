import React from 'react';
import OriginalFooterCopyright from '@theme-original/Footer/Copyright';

export default function FooterCopyright({ copyright }) {
  return (
    <OriginalFooterCopyright
      copyright={copyright.replace('{year}', String(new Date().getFullYear()))}
    />
  );
}
