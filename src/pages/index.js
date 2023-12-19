import { C2paProvider } from '@contentauth/react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import C2PAToolIcon from '../assets/images/cli.svg';
import HeroImage from '../assets/images/hero-2.svg';
import JSSDKIcon from '../assets/images/image.svg';
import RustSDKIcon from '../assets/images/wrench.svg';
import ComparisonTable from '../components/ComparisonTable';
import Features from '../components/Features';
import FeedbackLink from '../components/FeedbackLink';
import Hero from '../components/Hero';

export const features = [
  {
    id: 'js-sdk',
    title: 'JavaScript library',
    icon: <JSSDKIcon />,
    hasC2paMetadata: true,
    description: (
      <>Develop rich, browser-based experiences with Content Credentials.</>
    ),
    cta: {
      link: '/docs/js-sdk/getting-started/overview',
      label: 'View documentation',
    },
    media: '/img/Sunset.jpg',
  },
  {
    id: 'c2patool',
    title: 'C2PA Tool',
    icon: <C2PAToolIcon />,
    hasC2paMetadata: false,
    description: (
      <>
        Create, verify, and inspect Content Credentials using this command line
        tool.
      </>
    ),
    cta: {
      link: '/docs/c2patool',
      label: 'View documentation',
    },
    media: <img src="/img/c2patool@2x.png" />,
  },

  {
    id: 'other-langs',
    title: 'Other language libraries',
    icon: <RustSDKIcon />,
    hasC2paMetadata: false,
    description: (
      <>
        Develop custom applications for desktop, mobile, and web that create,
        verify, and display Content Credentials using your preferred programming
        language.
      </>
    ),
    cta: {
      link: '/docs/other-langs',
      label: 'View documentation',
    },
    media: <img src="/img/other-langs.png" />,
  },

  {
    id: 'rust-sdk',
    title: 'Rust library',
    icon: <RustSDKIcon />,
    hasC2paMetadata: false,
    description: (
      <>
        Develop custom applications across desktop, mobile, and web services
        that create, verify, and display Content Credentials.
      </>
    ),
    cta: {
      link: '/docs/rust-sdk',
      label: 'View documentation',
    },
    media: <img src="/img/rust-sdk@3x.png" />,
  },
];

const comparisonColumns = [
  {
    key: 'implementation',
    label: 'Use To...',
    type: 'string',
  },
  {
    key: 'jsSDK',
    label: 'JavaScript Library',
    type: 'boolean',
  },
  {
    key: 'c2paTool',
    label: 'C2PA Tool',
    type: 'boolean',
  },
  {
    key: 'otherLangs',
    label: 'Other Language Libraries',
    type: 'boolean',
  },
  {
    key: 'rustSDK',
    label: 'Rust Library',
    type: 'boolean',
  },
];

const comparisonRecords = [
  {
    implementation: 'Display C2PA data on your site or app',
    jsSDK: true,
    c2paTool: true,
    otherLangs: true,
    rustSDK: true,
  },
  {
    implementation: 'Link C2PA data displayed on your site to Verify',
    jsSDK: true,
    c2paTool: true,
    otherLangs: true,
    rustSDK: true,
  },
  {
    implementation: 'Write C2PA data into files',
    jsSDK: false,
    c2paTool: true,
    otherLangs: true,
    rustSDK: true,
  },
  {
    implementation: 'Quickly create and inspect C2PA data',
    jsSDK: false,
    c2paTool: true,
    otherLangs: true,
    rustSDK: true,
  },
  {
    implementation: 'Customize displaying and creating C2PA data',
    jsSDK: false,
    c2paTool: false,
    otherLangs: true,
    rustSDK: true,
  },
  {
    implementation: 'Deploy on Web, mobile, and desktop',
    jsSDK: false,
    c2paTool: false,
    otherLangs: true,
    rustSDK: true,
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  const wasmSrc =
    'https://cdn.jsdelivr.net/npm/c2pa@0.17.6/dist/assets/wasm/toolkit_bg.wasm';
  const workerSrc =
    'https://cdn.jsdelivr.net/npm/c2pa@0.17.6/dist/c2pa.worker.min.js';

  return (
    <BrowserOnly>
      {() => (
        <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
          <Hero
            title={siteConfig.tagline}
            media={<HeroImage />}
            description={
              <>
                Integrate secure provenance signals into your site, app, or
                service using Content Authenticity Initiative open-source
                software. Join the ecosystem of transparency of provenance and
                attribution of digital content to counter the rise of
                misinformation.
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
              <FeedbackLink />
            </C2paProvider>
          </main>
        </Layout>
      )}
    </BrowserOnly>
  );
}
