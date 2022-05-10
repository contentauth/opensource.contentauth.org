import React from 'react';
import JSSDKIcon from '../assets/images/image.svg';
import C2PAToolIcon from '../assets/images/cli.svg';
import RustSDKIcon from '../assets/images/wrench.svg';

export const homepageFeatures = [
  {
    id: 'js-sdk',
    title: 'JS SDK',
    Icon: JSSDKIcon,
    description: (
      <React.Fragment>
        Everything you need to develop rich, browser-based experiences with
        content credentials.
      </React.Fragment>
    ),
    cta: {
      link: '/docs/intro',
      label: 'View documentation',
    },
    bgImage: '/img/js-ui-kit-bg-image.png',
  },
  {
    id: 'c2pa-tool',
    title: 'C2PA Tool',
    Icon: C2PAToolIcon,
    description: (
      <React.Fragment>
        Install this tool to create, verify and explore content credentials on
        the command line.
      </React.Fragment>
    ),
    cta: {
      link: '/',
      label: 'Coming soon',
      disabled: true,
    },
    bgImage: '/img/full-sdk-bg-image.svg',
  },
  {
    id: 'rust-sdk',
    title: 'Rust SDK',
    Icon: RustSDKIcon,
    description: (
      <React.Fragment>
        Develop custom applications across desktop, mobile, and services that
        create, verify, and display content credentials via our Rust library.
      </React.Fragment>
    ),
    cta: {
      link: '/',
      label: 'Coming soon',
      disabled: true,
    },
    bgImage: '/img/command-line-bg-image.svg',
  },
];
