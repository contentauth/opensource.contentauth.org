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
          label: 'FAQs',
          id: 'faqs',
        },
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
      label: 'Understanding manifests',
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
          id: 'manifest/manifest-examples',
          label: 'Examples',
        },
        {
          type: 'category',
          label: 'JSON reference',
          link: { type: 'doc', id: 'manifest/json-ref/index' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'manifest/json-ref/manifest-def',
            },
            {
              type: 'doc',
              id: 'manifest/json-ref/reader',
            },
          ],
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
          id: 'c2patool/docs/usage',
          label: 'Using C2PA Tool',
        },
        {
          type: 'doc',
          id: 'c2patool/docs/supported-formats',
          label: 'Supported media formats',
        },
        {
          type: 'doc',
          id: 'c2patool/docs/manifest',
          label: 'Using a manifest file',
        },
        {
          type: 'doc',
          id: 'c2patool/docs/x_509',
          label: 'Using a certificate',
        },
        {
          type: 'doc',
          id: 'c2patool/docs/changelog',
          label: 'Change log',
        },
        {
          type: 'doc',
          id: 'c2pa-service-example/readme',
          label: 'C2PA Tool service example',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-rs/tree/main/cli',
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
              type: 'doc',
              id: 'c2pa-node/docs/usage',
              label: 'Using the Node library',
            },
            {
              type: 'doc',
              id: 'c2pa-node/docs/supported-formats',
              label: 'Supported media formats',
            },
            {
              type: 'doc',
              id: 'c2pa-node/docs/release-notes',
              label: 'Release notes',
            },
            {
              type: 'doc',
              label: 'C2PA Node example',
              id: 'c2pa-node-example/readme',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-node',
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
              type: 'doc',
              id: 'c2pa-python/docs/usage',
              label: 'Using the Python library',
            },
            {
              type: 'doc',
              id: 'c2pa-python/docs/supported-formats',
              label: 'Supported media formats',
            },
            {
              type: 'doc',
              id: 'c2pa-python/docs/release-notes',
              label: 'Release notes',
            },
            {
              type: 'doc',
              id: 'c2pa-python-example/readme',
              label: 'C2PA Python example',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-python',
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
              type: 'doc',
              id: 'c2pa-c/docs/usage',
              label: 'Using the C++ library',
            },
            {
              type: 'doc',
              id: 'c2pa-c/docs/supported-formats',
              label: 'Supported media formats',
            },
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
          type: 'doc',
          id: 'rust-sdk/docs/usage',
          label: 'Using the Rust library',
        },
        {
          type: 'doc',
          id: 'rust-sdk/docs/supported-formats',
          label: 'Supported media formats',
        },
        {
          type: 'doc',
          id: 'rust-sdk/docs/release-notes',
          label: 'Release notes',
        },
        {
          type: 'link',
          label: 'API documentation',
          href: 'https://docs.rs/c2pa',
        },
        {
          type: 'doc',
          id: 'c2pa-min/readme',
          label: 'C2PA Rust example application',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-rs',
        },
      ],
    },
    {
      type: 'category',
      label: 'Signing and certificates',
      link: { type: 'doc', id: 'signing/signing-and-certs' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Using test certificates',
          id: 'signing/test-certs',
        },
        {
          type: 'doc',
          label: 'Getting a certificate',
          id: 'signing/get-cert',
        },
        {
          type: 'doc',
          label: 'Signing with local credentials',
          id: 'signing/local-signing',
        },
        {
          type: 'doc',
          label: 'Using a certificate in production',
          id: 'signing/prod-cert',
        },
      ],
    },
    {
      type: 'category',
      label: 'Durable Content Credentials',
      link: { type: 'doc', id: 'durable-cr' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Watermarking and fingerprinting',
          id: 'sb-algs',
        },
        {
          type: 'category',
          label: 'TrustMark watermarking',
          link: { type: 'doc', id: 'trustmark-intro' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'trustmark/README',
              label: 'Overview',
            },
            {
              type: 'doc',
              id: 'trustmark/python/CONFIG',
              label: 'Configuration',
            },
            {
              type: 'doc',
              id: 'trustmark/c2pa/README',
              label: 'Using with C2PA',
            },
            {
              type: 'doc',
              id: 'trustmark/js/README',
              label: 'JavaScript example',
            },
            {
              type: 'doc',
              id: 'trustmark/rust/README',
              label: 'Rust implementation',
            },
            {
              type: 'doc',
              id: 'trustmark/rust/crates/trustmark-cli/README',
              label: 'Rust CLI',
            },
            {
              type: 'doc',
              id: 'tm-faq',
              label: 'FAQ',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/adobe/trustmark/',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Community resources',
      link: { type: 'doc', id: 'community-resources' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Task planning & roadmap',
          id: 'roadmap',
        },
      ],
    },
  ],
};

module.exports = sidebars;
