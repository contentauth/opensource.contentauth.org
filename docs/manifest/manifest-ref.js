import React, { useEffect } from 'react';
import './cai-addon.css';
import { customScript } from './cai-customscripts.js';

const div = document.createElement('div');
const markdown = require('!!raw-loader!./reference-cai.html')?.default; // MDX Context
div.innerHTML = markdown;
const data = div.innerHTML;

const ManifestReference = () => {
  useEffect(() => {
    customScript;
  });
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

export default ManifestReference;
