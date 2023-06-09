const jsSdkSidebar = require('./docs/js-sdk/sidebars');

const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
    },
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting started',
    },
    {
      type: 'category',
      label: 'JavaScript SDK',
      collapsed: true,
      items: jsSdkSidebar.docs,
    },
    {
      type: 'category',
      label: 'c2patool',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'c2patool/readme',
        },
        {
          type: 'doc',
          id: 'c2pa-service-example/readme',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2patool',
        },
      ],
    },
    {
      type: 'category',
      label: 'Rust SDK',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'rust-sdk/readme',
        },
        {
          type: 'link',
          label: 'API documentation',
          href: 'https://docs.rs/c2pa',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-rs',
        },
      ],
    },
    {
      type: 'doc',
      id: 'signing-manifests',
    },
    {
      type: 'doc',
      id: 'community-resources',
    },
  ],
};

module.exports = sidebars;
