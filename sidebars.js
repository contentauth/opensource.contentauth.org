const jsSdkSidebar = require('./docs/js-sdk/sidebars');

const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
    },
    {
      type: 'category',
      label: 'Getting started',
      link: { type: 'doc', id: 'getting-started' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'verify',
        },
        {
          type: 'doc',
          id: 'verify-known-cert-list',
        },
      ],
    },
    {
      type: 'category',
      label: 'Working with manifests',
      link: { type: 'doc', id: 'manifest/understanding-manifest' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'manifest/assertions-actions',
        },
        {
          type: 'doc',
          id: 'manifest/ingredients',
        },
        {
          type: 'doc',
          id: 'manifest/manifest-validation',
        },
        {
          type: 'doc',
          id: 'manifest/signing-manifests',
        },
        {
          type: 'doc',
          id: 'manifest/tasks',
        },        
        {
          type: 'doc',
          id: 'manifest/manifest-examples',
          label: 'Examples',
        },
        {
          type: 'doc',
          id: 'manifest/manifest-ref',
        },
        {
          type: 'doc',
          id: 'manifest/manifest-json-schema',
          label: 'JSON schema',
        },
      ],
    },

    {
      type: 'category',
      label: 'C2PA Tool',
      link: { type: 'doc', id: 'c2patool/readme' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'c2patool/manifest',
          label: 'Using a manifest file',
        },
        {
          type: 'doc',
          id: 'c2patool/x_509',
          label: 'Creating and using a certificate',
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
      label: 'JavaScript library',
      link: { type: 'doc', id: 'js-sdk/getting-started/overview' },
      collapsed: true,
      items: jsSdkSidebar.docs,
    },

    {
      type: 'category',
      label: 'Prerelease libraries',
      link: { type: 'doc', id: 'other-langs' },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Node.js',
          link: { type: 'doc', id: 'c2pa-node/readme' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-node',
            },
            {
              type: 'doc',
              id: 'c2pa-node-example/readme',
            },
          ],
        },
        {
          type: 'category',
          label: 'Python',
          link: { type: 'doc', id: 'c2pa-python/readme' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-python',
            },
            {
              type: 'doc',
              label: 'C2PA Python Example',
              id: 'c2pa-python-example/readme',
            },
          ],
        },
        {
          type: 'category',
          label: 'C++ / C',
          link: { type: 'doc', id: 'c2pa-c/readme' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-c',
            },
          ],
        },
      ],
    },

    {
      type: 'category',
      label: 'Rust library',
      link: { type: 'doc', id: 'rust-sdk/readme' },
      collapsed: true,
      items: [
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
        {
          type: 'doc',
          label: 'C2PA Rust example application',
          id: 'c2pa-min/readme',
        },
      ],
    },
    {
      type: 'doc',
      label: 'Getting and using a certificate',
      id: 'prod-cert',
    },
    {
      type: 'doc',
      label: 'FAQs',
      id: 'faqs',
    },
    {
      type: 'doc',
      id: 'community-resources',
    },
    {
      type: 'doc',
      label: 'Task planning & roadmap',
      id: 'roadmap',
    },
  ],
};

module.exports = sidebars;
