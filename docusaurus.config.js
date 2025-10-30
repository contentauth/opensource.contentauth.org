// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

//const lightCodeTheme = require('prism-react-renderer/themes/github');
//const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const copyright = `
<div style="font-size: 0.75rem;">
  Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.
| <a style="text-decoration: underline;" href="https://www.adobe.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
| <a style="text-decoration: underline;" href="https://www.adobe.com/legal/terms.html" target="_blank" rel="noopener noreferrer">Terms of use</a>
| <a style="text-decoration: underline;" href="https://www.adobe.com/privacy/us-rights.html" target="_blank" rel="noopener noreferrer">Do not sell or share my personal information</a>
</div>
`;

// Map of external repositories to their GitHub repository names, paths, and organizations
const externalRepos = {
  'c2pa-c': { repo: 'c2pa-c', path: '', org: 'contentauth' },
  'c2pa-min': { repo: 'c2pa-min', path: '', org: 'contentauth' },
  'c2pa-node': { repo: 'c2pa-node', path: '', org: 'contentauth' },
  'c2pa-node-example': {
    repo: 'c2pa-node-example',
    path: '',
    org: 'contentauth',
  },
  'c2pa-python': { repo: 'c2pa-python', path: '', org: 'contentauth' },
  'c2pa-python-example': {
    repo: 'c2pa-python-example',
    path: '',
    org: 'contentauth',
  },
  'c2pa-service-example': {
    repo: 'c2pa-service-example',
    path: '',
    org: 'contentauth',
  },
  c2patool: { repo: 'c2pa-rs', path: 'cli/', org: 'contentauth' },
  'rust-sdk': { repo: 'c2pa-rs', path: '', org: 'contentauth' },
  trustmark: { repo: 'trustmark', path: '', org: 'adobe' },
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Open-source tools for content authenticity and provenance',
  tagline: 'Open-source tools for content authenticity and provenance',
  url: 'https://contentauth.netlify.com',
  baseUrl: '/',
  staticDirectories: ['static'],
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/favicon.png',
  organizationName: 'contentauth',
  projectName: 'opensource.contentauth.org',
  clientModules: [require.resolve('./src/assets/scripts/ui.js')],
  scripts: [
    // TODO: Re-enable analytics once we solve flicker problem
    // '/scripts/analytics.js',
    // 'https://www.adobe.com/marketingtech/main.min.js',
    {
      src: 'https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js',
      'data-domain-script': '20e82cdb-918a-4036-93c6-c356dc13a801',
    },
    '/scripts/cookie-pro.js',
  ],
  stylesheets: [
    // Acumin Pro
    'https://use.typekit.net/wgs7uns.css',
    // Adobe Clean
    'https://use.typekit.net/dnb4eqs.css',
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: ({ docPath }) => {
            // Don't show edit link for dynamically generated API docs
            if (docPath.startsWith('js-sdk/api/')) {
              return null;
            }

            // Special case for supported-formats.md files
            if (docPath.endsWith('supported-formats.md')) {
              return 'https://github.com/contentauth/c2pa-rs/edit/main/docs/supported-formats.md';
            }

            // Check if the doc is from an external repository
            const externalRepo = Object.keys(externalRepos).find((repo) =>
              docPath.startsWith(`${repo}/`),
            );

            if (externalRepo) {
              // Get the GitHub repository info for this external repo
              const repoInfo = externalRepos[externalRepo];
              // Remove the repo prefix from the path to get the relative path in the repo
              let repoPath = docPath.replace(`${externalRepo}/`, '');
              // Convert readme.md to README.md in the path
              repoPath = repoPath.replace(/readme\.md$/i, 'README.md');
              return `https://github.com/${repoInfo.org}/${repoInfo.repo}/edit/main/${repoInfo.path}${repoPath}`;
            }

            // Add edit link for main docs
            let mainPath = docPath;
            // Convert readme.md to README.md in the path
            mainPath = mainPath.replace(/readme\.md$/i, 'README.md');
            return `https://github.com/contentauth/opensource.contentauth.org/edit/main/docs/${mainPath}`;
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  // See here for configuration options:
  // https://docusaurus.io/docs/api/themes/configuration
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        //  { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'og:card', content: 'summary_large_image' },
        /*  
      {
          property: 'twitter:image',
          content:
            'https://opensource.contentauthenticity.org/img/open-source@2x.png?v=1',
        },
        {
          property: 'twitter:description',
          content:
            'Integrate secure provenance signals into your site, app, or service using open-source tools developed by the Content Authenticity Initiative.',
        },
        */
        {
          property: 'og:description',
          content:
            'Integrate secure provenance signals into your site, app, or service using open-source tools developed by the Content Authenticity Initiative.',
        },
        /*
        {
          property: 'twitter:title',
          content: 'Open-source tools for content authenticity and provenance',
        },
        */
        {
          property: 'og:title',
          content: 'Open-source tools for content authenticity and provenance',
        },
      ],
      // Relative to your site's 'static' directory.
      // Cannot be SVGs. Can be external URLs too.
      colorMode: {
        disableSwitch: true,
      },
      navbar: {
        logo: {
          alt: 'Content Authenticity Initiative',
          src: 'img/logo-cai.svg',
          width: 180,
          height: 54,
          href: 'https://contentauthenticity.org',
        },
        items: [
          {
            href: 'https://discord.gg/CAI',
            position: 'right',
            className: 'header-logo header-discord-link',
          },
          {
            href: 'https://github.com/contentauth',
            position: 'right',
            className: 'header-logo header-github-link',
          },
          /*
          {
            href: 'https://twitter.com/ContentAuth',
            position: 'right',
            className: 'header-logo header-twitter-link',
          },
          */
        ],
      },
      footer: {
        style: 'light',
        /*
        logo: {
          src: '#', // stop warning.
          alt: 'Content Authenticity Initiative',
          href: 'https://contentauthenticity.org',
        },
        */
        copyright,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'XOI00ZGSIB',

        // Public API key: it is safe to commit it
        apiKey: '8c42f1b6cc4394334d572acc5d216069',

        indexName: 'contentauthenticity',

        // Optional: see doc section below
        contextualSearch: true,
      },
    }),
  themes: ['docusaurus-json-schema-plugin'],
};

module.exports = config;
