import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useEffect, useRef, useState } from 'react';
import './cai-addon.css';
const referenceCAI = require('!!raw-loader!./reference-cai.html')?.default;

const ManifestReference = () => {
  const myRef = useRef(null);
  const [refAquired, setRefAquired] = useState(false);
  useEffect(() => {
    setRefAquired(true);
  }, []);

  useEffect(() => {
    if (myRef.current) {
      for (const link of myRef.current.querySelectorAll('a')) {
        if (link.hasAttribute('href')) {
          let linkStr = link.getAttribute('href');
          //console.log("Getting href for " + linkStr)
          if (linkStr.startsWith('crate::')) {
            link.setAttribute('href', '#' + linkStr.substring(7).toLowerCase());
          }
        }
      }
    }
  }, [refAquired]);

  return (
    <BrowserOnly>
      {() => (
        <div ref={myRef} dangerouslySetInnerHTML={{ __html: referenceCAI }} />
      )}
    </BrowserOnly>
  );
};

export default ManifestReference;
