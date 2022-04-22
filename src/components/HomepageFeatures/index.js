import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'JavaScript UI kit',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Everything you need to develop rich, browser-based experiences with
        content credentials.
      </>
    ),
    cta: {
      link: '/docs/intro',
      label: 'View documentation',
    },
    bgImage: require('@site/static/img/undraw_docusaurus_react.svg').default,
  },
  {
    title: 'Full SDK',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Develop custom applications across desktop, mobile, and services that
        create, verify, and display content credentials via our Rust library.
      </>
    ),
    cta: {
      link: '/docs/intro',
      label: 'View documentation',
    },
    bgImage: require('@site/static/img/undraw_docusaurus_react.svg').default,
  },
  {
    title: 'Command line utility',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Install this tool to create, verify and explore content credentials on
        the command line.
      </>
    ),
    cta: {
      link: '/docs/intro',
      label: 'Coming Soon',
      disabled: true,
    },
    bgImage: require('@site/static/img/undraw_docusaurus_react.svg').default,
  },
];

function Feature({
  Svg,
  title,
  description,
  cta: { link, label, disabled },
  bgImage,
}) {
  return (
    <div className={styles.feature}>
      <div className={styles.leftSide}>
        <Svg className={styles.featureSvg} role="img" />
        <div className="text--left">
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
        <div>
          <a
            className={clsx(styles.cta, { [styles.disabled]: disabled })}
            href={link}
            disabled={disabled}
          >
            {label}
          </a>
        </div>
      </div>
      <div className={styles.rightSide}>
        <Svg className={styles.bgImage} role="img" />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
