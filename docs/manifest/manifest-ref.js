import React from 'react';
import './style.scss';

const div = document.createElement('div');
const markdown = require('!!raw-loader!./reference-cai.html')?.default; // MDX Context
div.innerHTML = markdown;
const data = div.innerHTML;

const ManifestReference = () => {
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
};

export default ManifestReference;
