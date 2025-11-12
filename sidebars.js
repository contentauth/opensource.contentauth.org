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
      label: 'Working with manifests',
      link: { type: 'doc', id: 'manifest/understanding-manifest' },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Reading manifest data',
          link: { type: 'doc', id: 'manifest/reading/reading-index' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'manifest/reading/reading-ingredients',
            },
            {
              type: 'doc',
              id: 'manifest/reading/reading-cawg-id',
            },
            {
              type: 'doc',
              id: 'manifest/reading/legacy-manifests',
            },
            {
              type: 'doc',
              id: 'manifest/reading/manifest-validation',
            },
          ],
        },
        {
          type: 'category',
          label: 'Writing manifest data',
          link: { type: 'doc', id: 'manifest/writing/writing-index' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'manifest/writing/ingredients',
            },
            {
              type: 'doc',
              id: 'manifest/writing/assertions-actions',
            },
          ],
        },
        {
          type: 'category',
          label: 'JSON manifest reference',
          link: { type: 'doc', id: 'manifest/json-ref/index' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'manifest/json-ref/reader-schema',
              label: 'Reader',
            },
            {
              type: 'doc',
              id: 'manifest/json-ref/builder-schema',
              label: 'Builder',
            },
            {
              type: 'doc',
              id: 'manifest/json-ref/manifest-definition-schema',
              label: 'ManifestDefinition',
            },
            {
              type: 'doc',
              id: 'manifest/json-ref/settings-schema',
              label: 'Settings',
            },
          ],
        },
        {
          type: 'doc',
          id: 'manifest/manifest-examples',
          label: 'Examples',
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
          id: 'c2patool/docs/cawg_x509_signing',
          label: 'Using a certificate for CAWG signing',
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
          id: 'rust-sdk/docs/cawg-id',
          label: 'Using CAWG identity assertions',
        },
        {
          type: 'doc',
          id: 'rust-sdk/docs/settings',
          label: 'Configuring the SDK',
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
      label: 'JavaScript library',
      link: { type: 'doc', id: 'js-sdk/js-landing' },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'New JavaScript library',
          link: { type: 'doc', id: 'c2pa-js/readme' },
          items: [
            {
              type: 'link',
              label: 'API documentation',
              href: 'https://contentauth.github.io/c2pa-js/',
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
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-js-legacy',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Python library',
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
          id: 'c2pa-python/docs/examples',
          label: 'Python example code',
        },
        {
          type: 'doc',
          id: 'c2pa-python/docs/release-notes',
          label: 'Release notes',
        },
        {
          type: 'link',
          label: 'API documentation',
          href: 'https://contentauth.github.io/c2pa-python/api/c2pa/index.html',
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
      label: 'C++ / C library',
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
          label: 'API documentation',
          href: 'https://contentauth.github.io/c2pa-c/annotated.html',
        },
        {
          type: 'link',
          label: 'GitHub',
          href: 'https://github.com/contentauth/c2pa-c',
        },
      ],
    },
    {
      type: 'category',
      label: 'Node.js library',
      link: { type: 'doc', id: 'node-landing' },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'New Node.js library',
          link: { type: 'doc', id: 'c2pa-node-v2/readme' },
          collapsed: true,
          items: [
            {
              type: 'doc',
              id: 'c2pa-node-v2/supported-formats',
              label: 'Supported media formats',
            },
            {
              type: 'link',
              label: 'API documentation',
              href: 'https://contentauth.github.io/c2pa-node-v2/',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-node-v2/tree/main',
            },
          ],
        },
        {
          type: 'category',
          label: 'Legacy Node.js library',
          link: { type: 'doc', id: 'c2pa-node/readme' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-node',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Mobile libraries',
      link: { type: 'doc', id: 'mobile' },
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'iOS',
          link: { type: 'doc', id: 'c2pa-ios/README' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'API documentation',
              href: 'https://contentauth.github.io/c2pa-ios/documentation/c2pa/',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-ios',
            },
          ],
        },
        {
          type: 'category',
          label: 'Android',
          link: { type: 'doc', id: 'c2pa-android/README' },
          collapsed: true,
          items: [
            {
              type: 'link',
              label: 'API documentation',
              href: 'https://contentauth.github.io/c2pa-android/',
            },
            {
              type: 'link',
              label: 'GitHub',
              href: 'https://github.com/contentauth/c2pa-android',
            },
          ],
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
      type: 'doc',
      label: 'C2PA conformance program',
      id: 'conformance',
    },
    {
      type: 'category',
      label: 'Durable Content Credentials',
      link: { type: 'doc', id: 'durable-cr/index' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'Watermarking and fingerprinting',
          id: 'durable-cr/sb-algs',
        },
        {
          type: 'category',
          label: 'TrustMark watermarking',
          link: { type: 'doc', id: 'durable-cr/trustmark-intro' },
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
              type: 'link',
              label: 'TrustMark Rust API docs',
              href: 'https://docs.rs/trustmark',
            },
            {
              type: 'doc',
              id: 'durable-cr/tm-faq',
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
