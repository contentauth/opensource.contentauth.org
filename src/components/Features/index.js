import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export function Feature({ id, Icon, title, description, cta, bgImage }) {
  return (
    <div id={id} className={styles.feature}>
      <div className={styles.leftSide}>
        <Icon className={styles.featureSvg} role="img" />
        <div className="text--left">
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
        <div>
          <a
            className={clsx(styles.cta, { [styles.ctaDisabled]: cta.disabled })}
            href={cta.link}
          >
            {cta.label}
          </a>
        </div>
      </div>
      <div className={styles.rightSide}>
        <img className={styles.bgImage} src={bgImage} />
      </div>
    </div>
  );
}

export default function Features({ features = [] }) {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresContent}>
          {features.map((props, i) => (
            <Feature key={`homepage-feature-${props.id || i}`} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
