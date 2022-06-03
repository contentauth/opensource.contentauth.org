import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import { useC2pa } from '@contentauth/react-hooks';
import { generateVerifyUrl } from 'c2pa';
import BrowserOnly from '@docusaurus/BrowserOnly';

export function Feature({
  id,
  icon,
  hasC2paMetadata,
  media,
  title,
  description,
  cta,
}) {
  let provenance = null;
  hasC2paMetadata ? (provenance = useC2pa(media)) : (provenance = null);
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
      {hasC2paMetadata && provenance ? (
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => {
            const viewMoreUrl = generateVerifyUrl(
              window.location.origin + media,
            );
            const { WebComponents } = require('../WebComponents');
            return (
              <div className={styles.featureMedia}>
                <WebComponents
                  imageUrl={media}
                  provenance={provenance}
                  viewMoreUrl={viewMoreUrl}
                />
              </div>
            );
          }}
        </BrowserOnly>
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
