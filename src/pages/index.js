import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageTable from '@site/src/components/HomepageTable';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>{siteConfig.tagline}</h1>
        <div className={styles.heroDescWrapper}>
          <div className={styles.heroDescription}>
            <hr className={styles.heroDivider} />
            <p>
              Integrate secure provenance signals into your site, app, or
              service using open-source tools developed by the Content
              Authenticity Initiative. Join the ecosystem of transparency of
              provenance and attribution of digital content to counter the rise
              of misinformation.
            </p>
          </div>
          <img className={styles.heroDescImage} src="/img/hero.svg" />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
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
