import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useEffect, useRef, useState } from 'react';
import './cai-addon.css';

// Import all possible HTML files statically
const htmlFiles = {
  './manifest-def.html': require('!!raw-loader!./manifest-def.html')?.default,
  './reader.html': require('!!raw-loader!./reader.html')?.default,
  // Add other HTML files here as needed
};

const ManifestReference = ({ htmlPath }) => {
  const myRef = useRef(null);
  const [refAquired, setRefAquired] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setRefAquired(true);
  }, []);

  useEffect(() => {
    // Get the HTML content from our static imports
    const content = htmlFiles[htmlPath];
    if (content) {
      setHtmlContent(content);
    } else {
      console.error(`HTML file not found: ${htmlPath}`);
      setHtmlContent('<div>Error: HTML file not found</div>');
    }
  }, [htmlPath]);

  useEffect(() => {
    if (myRef.current) {
      for (const link of myRef.current.querySelectorAll('a')) {
        if (link.hasAttribute('href')) {
          let linkStr = link.getAttribute('href');
          if (linkStr.startsWith('crate::')) {
            link.setAttribute('href', '#' + linkStr.substring(7).toLowerCase());
          }
        }
      }
    }
  }, [refAquired, htmlContent]);

  return (
    <BrowserOnly>
      {() => (
        <div ref={myRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
    </BrowserOnly>
  );
};

export default ManifestReference;
