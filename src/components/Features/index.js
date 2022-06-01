import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
// import { WebComponents } from '../WebComponents';
import { useC2pa } from '@contentauth/react-hooks';
import { generateVerifyUrl } from 'c2pa';
import BrowserOnly from '@docusaurus/BrowserOnly';

export function Feature({ id, icon, c2pa, media, title, description, cta }) {
  const sampleImage = '/img/Sunset.jpg';

  const provenance = useC2pa(sampleImage);

  return (
    <div id={id} className={styles.feature}>
      <div className={styles.featureInfo}>
        <div className={styles.featureContent}>
          <i className={styles.featureIcon}>{icon}</i>
          <h3 className={styles.featureTitle}>{title}</h3>
          <div className={styles.featureDescription}>
            <p>{description}</p>
          </div>
        </div>
        <div className={styles.featureActions}>
          <Link
            to={cta.link}
            className={clsx(styles.featureCTA, {
              [styles.featureCTADisabled]: cta.disabled,
            })}
          >
            {cta.label}
          </Link>
        </div>
      </div>
      {c2pa && provenance ? (
        <div>
          <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
              const viewMoreUrl = generateVerifyUrl(
                window.location.origin + sampleImage,
              );
              console.log(viewMoreUrl);
              const { WebComponents } = require('../WebComponents');
              return (
                <WebComponents
                  imageUrl={sampleImage}
                  provenance={provenance}
                  viewMoreUrl={viewMoreUrl}
                />
              );
            }}
          </BrowserOnly>
        </div>
      ) : (
        <div className={styles.featureMedia}>{media}</div>
      )}
    </div>
  );
}

export default function Features({ features = [] }) {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.list}>
          {features.map((props, i) => (
            <Feature key={props.id || i} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
