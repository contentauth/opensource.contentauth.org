import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import { createC2pa } from 'c2pa';
import wasmSrc from '@site/static/dist/assets/wasm/toolkit_bg.wasm';
import workerSrc from '@site/static/dist/c2pa.worker.min.js';
import ManifestInfo from '../ManifestInfo';
import WebComponents from '../WebComponents';
import { resolvers } from 'c2pa';

export function Feature({ id, icon, c2pa, media, title, description, cta }) {
  const sampleImage =
    'https://cdn.jsdelivr.net/gh/contentauth/c2pa-js/tests/assets/CAICAI.jpg';

  (async () => {
    // Initialize the c2pa-js SDK
    const c2pa = await createC2pa({
      wasmSrc,
      workerSrc,
    });

    // Read in our sample image and get a manifest store
    try {
      const { manifestStore } = await c2pa.read(sampleImage);
      console.log('manifestStore', manifestStore);

      // Get the active manifest
      const activeManifest = manifestStore?.activeManifest;
      console.log('activeManifest', activeManifest);
    } catch (err) {
      console.error('Error reading image:', err);
    }
  })();
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
      {c2pa ? (
        <div>allo</div>
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
