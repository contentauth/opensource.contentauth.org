import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Features from '../components/Features';
import ComparisonTable from '../components/ComparisonTable';
import Hero from '../components/Hero';
import JSSDKIcon from '../assets/images/image.svg';
import C2PAToolIcon from '../assets/images/cli.svg';
import RustSDKIcon from '../assets/images/wrench.svg';
import HeroImage from '../assets/images/hero-2.svg';
import { C2paProvider } from '@contentauth/react-hooks';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
export const features = [
  {
    id: 'js-sdk',
    title: 'JS SDK',
    icon: <JSSDKIcon />,
    c2pa: true,
    description: (
      <>
        Everything you need to develop rich, browser-based experiences with
        content credentials.
      </>
    ),
    cta: {
      link: '/docs/introduction',
      label: 'View documentation',
    },
    media: <img src="/img/Sunset.jpg" />,
  },
  {
    id: 'c2pa-tool',
    title: 'C2PA Tool',
    icon: <C2PAToolIcon />,
    c2pa: false,
    description: (
      <>
        Install this tool to create, verify and explore content credentials on
        the command line.
      </>
    ),
    cta: {
      link: '/',
      label: 'Coming soon',
      disabled: true,
    },
    media: <img src="/img/c2patool@2x.png" />,
  },
  {
    id: 'rust-sdk',
    title: 'Rust SDK',
    icon: <RustSDKIcon />,
    c2pa: false,
    description: (
      <>
        Develop custom applications across desktop, mobile, and services that
        create, verify, and display content credentials via our Rust library.
      </>
    ),
    cta: {
      link: '/',
      label: 'Coming soon',
      disabled: true,
    },
    media: <img src="/img/rust-sdk@3x.png" />,
  },
];

const comparisonColumns = [
  {
    key: 'implementation',
    label: 'Implementation',
    type: 'string',
  },
  {
    key: 'jsSDK',
    label: 'JS SDK',
    type: 'boolean',
  },
  {
    key: 'c2paTool',
    label: 'C2PA Tool',
    type: 'boolean',
  },
  {
    key: 'rustSDK',
    label: 'Rust SDK',
    type: 'boolean',
  },
];

const comparisonRecords = [
  {
    implementation: 'Display C2PA data on your site or app',
    jsSDK: true,
    c2paTool: true,
    rustSDK: true,
  },
  {
    implementation: 'Link C2PA data displayed on your site to Verify',
    jsSDK: true,
    c2paTool: true,
    rustSDK: true,
  },
  {
    implementation: 'Write C2PA data into files',
    jsSDK: false,
    c2paTool: true,
    rustSDK: true,
  },
  {
    implementation: 'Quickly create and inspect C2PA data',
    jsSDK: false,
    c2paTool: true,
    rustSDK: true,
  },
  {
    implementation: 'Customize displaying and creating C2PA data',
    jsSDK: false,
    c2paTool: false,
    rustSDK: true,
  },
  {
    implementation: 'Deploy on Web, mobile, and desktop',
    jsSDK: false,
    c2paTool: false,
    rustSDK: true,
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  const wasmSrc =
    'https://cdn.jsdelivr.net/npm/c2pa@0.9.1/dist/assets/wasm/toolkit_bg.wasm';
  const workerSrc =
    'https://cdn.jsdelivr.net/npm/c2pa@0.9.1/dist/c2pa.worker.min.js';
  if (ExecutionEnvironment.canUseDOM) {
    return (
      <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
        <Hero
          title={siteConfig.tagline}
          media={<HeroImage />}
          description={
            <>
              Integrate secure provenance signals into your site, app, or
              service using open-source tools developed by the&nbsp;
              <a
                href="https://contentauthenticity.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Content Authenticity Initiative
              </a>
              . Join the ecosystem of transparency of provenance and attribution
              of digital content to counter the rise of misinformation.
            </>
          }
        />
        <main>
          <C2paProvider
            config={{
              wasmSrc,
              workerSrc,
            }}
          >
            <Features features={features} />
            <ComparisonTable
              title="Which tool is right for you?"
              columns={comparisonColumns}
              records={comparisonRecords}
            />
          </C2paProvider>
          ;
        </main>
      </Layout>
    );
  }
}
