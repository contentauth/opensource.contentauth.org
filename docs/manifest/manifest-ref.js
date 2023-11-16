import React from 'react';
const markdown = require('!!raw-loader!./reference-cai.html')?.default; // MDX Context

const ManifestReference = () => {
  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};

export default ManifestReference;
