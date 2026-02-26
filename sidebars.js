const remoteDocs = require('./remote-docs.json');

function getDocId(dest) {
  if (!dest.startsWith('docs/')) return null;
  return dest.replace(/^docs\//, '').replace(/\.(md|mdx|json)$/i, '');
}

function getRemoteSidebarItems(category, excludeIds = []) {
  return remoteDocs.sources
    .filter((s) => s.sidebar?.category === category)
    .sort((a, b) => (a.sidebar.order ?? 0) - (b.sidebar.order ?? 0))
    .map((s) => ({
      type: 'doc',
      id: getDocId(s.dest),
      label: s.sidebar.label,
    }))
    .filter((item) => item.id && !excludeIds.includes(item.id));
}

const sidebars = {
  docs: [
    {
      type: 'doc',
      id: 'introduction',
    },
    {
      type: 'category',
      label: 'Getting started',
      link: { type: 'doc', id: 'getting-started/index' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          label: 'FAQs',
          id: 'getting-started/faqs',
        },
        {
          type: 'doc',
          label: 'Using ACA Inspect',
          id: 'getting-started/inspect',
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
          type: 'doc',
          id: 'manifest/manifest-examples',
          label: 'Examples',
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
      label: 'C2PA Tool',
      link: { type: 'doc', id: 'c2patool/c2patool-index' },
      collapsed: true,
      items: [
        ...getRemoteSidebarItems('c2patool'),
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
        ...getRemoteSidebarItems('rust-sdk', ['rust-sdk/readme']),
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
      type: 'category',
      label: 'SDK object reference',
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
      type: 'category',
      label: 'Python library',
      link: { type: 'doc', id: 'c2pa-python/readme' },
      collapsed: true,
      items: [
        ...getRemoteSidebarItems('c2pa-python', ['c2pa-python/readme']),
        {
          type: 'link',
          label: 'API documentation',
          href: 'https://contentauth.github.io/c2pa-python/api/c2pa/index.html',
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
        ...getRemoteSidebarItems('c2pa-c', ['c2pa-c/readme']),
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
      label: 'JavaScript library',
      link: { type: 'doc', id: 'js-sdk/js-landing' },
      collapsed: true,
      items: [
        ...getRemoteSidebarItems('c2pa-js'),
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
      label: 'Node.js library',
      link: { type: 'doc', id: 'node-landing' },
      collapsed: true,
      items: [
        ...getRemoteSidebarItems('c2pa-node-v2'),
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
            ...getRemoteSidebarItems('c2pa-ios').filter(
              (i) => i.id !== 'c2pa-ios/README',
            ),
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
            ...getRemoteSidebarItems('c2pa-android').filter(
              (i) => i.id !== 'c2pa-android/README',
            ),
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
      label: 'C2PA conformance program',
      link: { type: 'doc', id: 'conformance/index' },
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'conformance/trust-lists',
        },
      ],
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
            ...getRemoteSidebarItems('trustmark'),
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
