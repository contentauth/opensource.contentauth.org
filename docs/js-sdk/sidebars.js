const api = require('./api/api-sidebar');

const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting started',
      items: [
        'js-sdk/getting-started/overview',
        'js-sdk/getting-started/quick-start',
        'js-sdk/getting-started/architecture',
        'js-sdk/getting-started/browser-support',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'js-sdk/guides/viewing-provenance',
        'js-sdk/guides/validation',
        // "js-sdk/guides/resolvers",
        // "js-sdk/guides/web-components",
        'js-sdk/guides/debugging',
        'js-sdk/guides/hosting',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'API documentation',
      items: api('js-sdk/api'),
      collapsed: true,
    },
    {
      type: 'link',
      label: 'GitHub',
      href: 'https://github.com/contentauth/c2pa-js',
    },
  ],
};

module.exports = sidebars;
