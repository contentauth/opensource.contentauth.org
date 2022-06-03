/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
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
      type: 'link',
      label: 'Rust SDK',
      href: 'https://docs.rs/c2pa/',
    },
    {
      type: 'link',
      label: 'c2patool',
      href: 'https://github.com/contentauth/c2pa-rs/tree/main/c2patool/src',
    },
  ],
};

module.exports = sidebars;
