const api = require('./api/api-sidebar');

const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting started',
      items: [
        'js-sdk/getting-started/overview',
        'js-sdk/getting-started/quick-start',
        'js-sdk/getting-started/concepts',
        'js-sdk/getting-started/browser-support',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'js-sdk/guides/viewing-provenance',
        // "guides/resolvers",
        // "guides/web-components",
        // "guides/react-hooks",
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
  ],
};

module.exports = sidebars;
