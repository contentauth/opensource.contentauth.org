// const api = require('./api/api-sidebar');

const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'New JavaScript library',
      link: { type: 'doc', id: 'js-sdk/js-lib-v2' },
      items: [
        {
          type: 'doc',
          label: 'C2PA web library',
          id: 'c2pa-js/readme',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-js',
        },
      ],
    },
    {
      type: 'category',
      label: 'Legacy JavaScript library',
      link: { type: 'doc', id: 'js-sdk/getting-started/old-js-overview' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Quick start',
          id: 'js-sdk/getting-started/quick-start',
        },
        {
          type: 'doc',
          label: 'Examples',
          id: 'js-sdk/guides/examples',
        },
        {
          type: 'doc',
          label: 'Architecture',
          id: 'js-sdk/getting-started/architecture',
        },
        {
          type: 'doc',
          label: 'Hosting assets',
          id: 'js-sdk/guides/hosting',
        },
        {
          type: 'category',
          label: 'Viewing manifest data',
          link: { type: 'doc', id: 'js-sdk/guides/viewing-manifest-data' },
          items: ['js-sdk/guides/selectors', 'js-sdk/guides/validation'],
          collapsed: true,
        },
        /*
        {
          type: 'category',
          label: 'API documentation',
          items: api('js-sdk/api'),
          collapsed: true,
        },
        */
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-js-legacy',
        },
      ],
    },
  ],
};

module.exports = sidebars;
