import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useEffect, useRef } from 'react';
import './cai-addon.css';
import { customScript } from './cai-customscripts.js';
const referenceCAI = require('!!raw-loader!./reference-cai.html')?.default;

const ManifestReference = () => {
  //using a ref to be able to access the innerHTML of the referenceCAI file so that the <body></body> tags dont show in the DOM
  let myRef = useRef(null);

  useEffect(() => {
    myRef = referenceCAI.innerHTML;
    customScript;
  });

  return (
    <BrowserOnly>
      {() => (
        <div ref={myRef} dangerouslySetInnerHTML={{ __html: referenceCAI }} />
      )}
    </BrowserOnly>
  );
};

export default ManifestReference;
