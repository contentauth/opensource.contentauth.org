const jsSdkSidebar = require('./docs/js-sdk/sidebars');

const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
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
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-rs/tree/main/c2patool/src',
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
          href: 'https://github.com/contentauth/c2patool',
        },
      ],
    },
  ],
};

module.exports = sidebars;
