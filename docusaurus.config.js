// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CAI Open Source',
  tagline: 'Open-source tools for content authenticity and provenance',
  url: 'https://contentauth.netlify.com',
  baseUrl: '/',
  staticDirectories: ['static'],
  onBrokenLinks: 'throw',
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
      colorMode: {
        disableSwitch: true,
      },
      navbar: {
        logo: {
          alt: 'Content Authenticity Initiative',
          src: 'img/logo-cai.svg',
          width: 180,
          height: 54,
        },
        items: [
          {
            to: '/docs/introduction',
            position: 'right',
            label: 'Docs',
          },
          {
            to: 'https://www.contentauthenticity.org',
            label: 'Learn more',
            position: 'right',
          },
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
        ],
      },
      footer: {
        style: 'light',
        logo: {
          src: '#', // stop warning.
          alt: 'Content Authenticity Initiative',
          href: 'https://contentauthenticity.org',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Adobe. All rights reserved. <a href="https://www.adobe.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a> | <a href="https://www.adobe.com/legal/terms.html" target="_blank" rel="noopener noreferrer">Terms of Use</a> | <button href="/" id="ot-sdk-button" class="ot-sdk-show-settings">Cookie Preferences</button>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
