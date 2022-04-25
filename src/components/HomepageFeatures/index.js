import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'JavaScript UI kit',
    Svg: require('@site/static/img/js-ui-kit.svg').default,
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
    bgImage: '/img/js-ui-kit-bg-image.png',
  },
  {
    title: 'Full SDK',
    Svg: require('@site/static/img/full-sdk.svg').default,
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
    bgImage: '/img/full-sdk-bg-image.svg',
  },
  {
    title: 'Command line utility',
    Svg: require('@site/static/img/command-line.svg').default,
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
    bgImage: '/img/command-line-bg-image.svg',
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
        <img className={styles.bgImage} src={bgImage} />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresContent}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
