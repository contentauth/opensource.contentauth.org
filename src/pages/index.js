import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageTable from '@site/src/components/HomepageTable';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.tagline}</h1>
        <div className={styles.heroDescWrapper}>
          <p className={styles.heroDescription}>
            Lorem ipsum dolor sit amet, praesent pericula imperdiet duo te. Duo
            te aeterno reprimique ullamcorper. Eos commodo philosophia ex, et
            per iudico quando, ut his commune necessitatibus.
          </p>
          <object
            type="image/svg+xml"
            width={470}
            height={345}
            data={'/img/hero-bg-image.svg'}
          >
            svg-animation
          </object>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  // This is where the landing page component can go
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageTable />
      </main>
    </Layout>
  );
}
