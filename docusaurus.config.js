// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

//const lightCodeTheme = require('prism-react-renderer/themes/github');
//const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
const remoteDocs = require('./remote-docs.json');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const copyright = `
<div style="font-size: 0.75rem;">
  Copyright © ${new Date().getFullYear()} Adobe. All rights reserved.
| <a style="text-decoration: underline;" href="https://www.adobe.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
| <a style="text-decoration: underline;" href="https://www.adobe.com/legal/terms.html" target="_blank" rel="noopener noreferrer">Terms of use</a>
| <a style="text-decoration: underline;" href="https://www.adobe.com/privacy/us-rights.html" target="_blank" rel="noopener noreferrer">Do not sell or share my personal information</a>
</div>
`;

// Map of external repositories to their GitHub repository names, paths, and organizations
// Used to create 'Edit this page' links
const externalRepos = {
  'c2pa-cpp': { repo: 'c2pa-cpp', path: '', org: 'contentauth' },
  'c2pa-ios': { repo: 'c2pa-ios', path: '', org: 'contentauth' },
  'c2pa-android': { repo: 'c2pa-android', path: '', org: 'contentauth' },
  'c2pa-js': { repo: 'c2pa-js', path: '', org: 'contentauth' },

  'c2pa-node-v2': { repo: 'c2pa-node', path: '', org: 'contentauth' },
  'c2pa-python': { repo: 'c2pa-python', path: '', org: 'contentauth' },
  'c2pa-python-example': {
    repo: 'c2pa-python-example',
    path: '',
    org: 'contentauth',
  },

  c2patool: { repo: 'c2pa-rs', path: 'cli/', org: 'contentauth' },
  'rust-sdk': { repo: 'c2pa-rs', path: '', org: 'contentauth' },
  trustmark: { repo: 'trustmark', path: '', org: 'adobe' },
};

// Exact edit URLs for docs that are mirrored from remote-docs.json sources.
// This handles cases where local doc names differ from source repo paths.
/** @type {Record<string, string>} */
const remoteDocEditUrls = {};

for (const source of remoteDocs.sources) {
  if (typeof source.dest !== 'string' || !source.dest.startsWith('docs/')) {
    continue;
  }
  if (typeof source.repo !== 'string' || typeof source.path !== 'string') {
    continue;
  }

  const docPath = source.dest.replace(/^docs\//, '').toLowerCase();
  let branch = 'main';
  if ('branch' in source && typeof source.branch === 'string') {
    branch = source.branch;
  }

  remoteDocEditUrls[
    docPath
  ] = `https://github.com/${source.repo}/edit/${branch}/${source.path}`;
}

const contentauthGithubBaseUrl = 'https://github.com/contentauth/';
const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
const customEditPathRegex = /^\s*custom_edit_path:\s*(.+?)\s*$/m;
/** @type {Map<string, string | null>} */
const customEditUrlCache = new Map();

/**
 * Reads a doc's frontmatter and returns its custom contentauth edit URL, if any.
 * @param {string | undefined} versionDocsDirPath
 * @param {string} docPath
 * @returns {string | null}
 */
function getFrontMatterCustomEditUrl(versionDocsDirPath, docPath) {
  if (!versionDocsDirPath) {
    return null;
  }

  const cacheKey = `${versionDocsDirPath}:${docPath}`;
  if (customEditUrlCache.has(cacheKey)) {
    return customEditUrlCache.get(cacheKey) ?? null;
  }

  let customEditUrl = null;
  try {
    const markdown = readFileSync(resolve(versionDocsDirPath, docPath), 'utf8');
    const frontMatterMatch = markdown.match(frontMatterRegex);
    if (frontMatterMatch) {
      const customEditPathMatch =
        frontMatterMatch[1].match(customEditPathRegex);
      if (customEditPathMatch) {
        const customEditPath = customEditPathMatch[1]
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .replace(/^\/+/, '');
        if (customEditPath) {
          customEditUrl = `${contentauthGithubBaseUrl}${customEditPath}`;
        }
      }
    }
  } catch {
    // Ignore missing/non-readable files and continue with default edit URL logic.
  }

  customEditUrlCache.set(cacheKey, customEditUrl);
  return customEditUrl;
}

/** @returns {Promise<import('@docusaurus/types').Config>} */
async function createConfig() {
  const { default: remarkGithubAdmonitionsToDirectives } = await import(
    'remark-github-admonitions-to-directives'
  );

  return {
    title: 'Open-source tools for content authenticity and provenance',
    tagline: 'Open-source tools for content authenticity and provenance',
    url: 'https://contentauth.netlify.com',
    baseUrl: '/',
    staticDirectories: ['static'],
    onBrokenLinks: 'warn',
    // Schema reference pages (docs/manifest/json-ref/*-ref.mdx) render headings and
    // ids inside SchemaReference from JSON Schema at runtime, so build-time anchor
    // extraction cannot see those hashes. Links to #fragments on those pages are valid.
    onBrokenAnchors: 'log',
    markdown: {
      mermaid: true,
      hooks: {
        onBrokenMarkdownLinks: 'warn',
      },
    },
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
            beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl: ({ docPath, versionDocsDirPath }) => {
              const normalizedDocPath = docPath.toLowerCase();

              // Don't show edit link for dynamically generated API docs
              if (docPath.startsWith('js-sdk/api/')) {
                return null;
              }

              // Special case for supported-formats.md files
              if (docPath.endsWith('supported-formats.md')) {
                return 'https://github.com/contentauth/c2pa-rs/edit/main/docs/supported-formats.md';
              }

              // Allow docs to point at a contentauth README/source via frontmatter.
              const customEditUrl = getFrontMatterCustomEditUrl(
                versionDocsDirPath,
                docPath,
              );
              if (customEditUrl) {
                return customEditUrl;
              }

              // Use explicit source mappings from remote-docs.json when available.
              const remoteDocEditUrl = remoteDocEditUrls[normalizedDocPath];
              if (remoteDocEditUrl) {
                return remoteDocEditUrl;
              }

              // Check if the doc is from an external repository
              const externalRepo = Object.keys(externalRepos).find((repo) =>
                normalizedDocPath.startsWith(`${repo}/`),
              );

              if (externalRepo) {
                // Get the GitHub repository info for this external repo
                const repoInfo = externalRepos[externalRepo];
                // Remove the repo prefix from the path to get the relative path in the repo
                let repoPath = normalizedDocPath.replace(
                  `${externalRepo}/`,
                  '',
                );
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
          {
            property: 'og:description',
            content:
              'Integrate secure provenance signals into your site, app, or service using open-source tools developed by the Content Authenticity Initiative.',
          },
          {
            property: 'og:title',
            content:
              'Open-source tools for content authenticity and provenance',
          },
        ],
        // Relative to your site's 'static' directory.
        // Cannot be SVGs. Can be external URLs too.
        colorMode: {
          disableSwitch: true,
        },
        docs: {
          sidebar: {
            hideable: true,
            autoCollapseCategories: true,
          },
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
            {
              href: 'http://learn.contentauthenticity.org/',
              position: 'right',
              className: 'header-logo header-learn-link',
            },
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
          apiKey: '5b5b38fb40adb6dfa25b6bccb03815a5',

          indexName: 'contentauthenticity',

          // Optional: see doc section below
          contextualSearch: true,
        },
      }),
    plugins: [
      [
        '@signalwire/docusaurus-plugin-llms-txt',
        {
          siteDescription:
            'Integrate secure provenance signals into your site, app, or service using open-source tools developed by the Content Authenticity Initiative.',
          depth: 2,
        },
      ],
    ],
    themes: ['docusaurus-json-schema-plugin', '@docusaurus/theme-mermaid'],
  };
}

module.exports = createConfig();
