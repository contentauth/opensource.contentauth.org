/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
const api = require('./api/api-sidebar');

const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: 'category',
      label: 'Getting started',
      items: [
        'js-sdk/getting-started/overview',
        'js-sdk/getting-started/quick-start',
        'js-sdk/getting-started/concepts',
        'js-sdk/getting-started/browser-support',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'js-sdk/guides/viewing-provenance',
        // "guides/resolvers",
        // "guides/web-components",
        // "guides/react-hooks",
        'js-sdk/guides/debugging',
        'js-sdk/guides/hosting',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'API documentation',
      items: api('js-sdk/api'),
      collapsed: true,
    },
    /**
     * TODO: Add API support back in.
     * Docusaurus has issues with parsing the HTML comments in the generated markdown files.
     * The solution here is to make a custom pipeline as described in the
     * [api-extractor docs](https://api-extractor.com/pages/setup/custom_docs/).
     */
    // {
    //   type: "category",
    //   label: "API",
    //   items: [
    //     {
    //       type: "doc",
    //       id: "api/c2pa/c2pa",
    //       label: "c2pa",
    //     },
    //   ],
    //   collapsed: false,
    // },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;
