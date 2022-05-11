import React from 'react';
import styles from './index.module.css';

export default function Hero({ title, description, media }) {
  return (
    <header className={styles.root}>
      <div className="container">
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.content}>
          <div className={styles.description}>
            <hr className={styles.hr} />
            <p>{description}</p>
          </div>
          <div className={styles.image}>{media}</div>
        </div>
      </div>
    </header>
  );
}
