import React from 'react';
import styles from './styles.module.css';

export default function FeedbackLink() {
  return (
    <div className={styles.root}>
      <b>Contribute and give feedback!</b> Chat with us on{' '}
      <a href="https://discord.gg/CAI">Discord</a> or start a discussion on{' '}
      <a href="https://github.com/contentauth">GitHub</a>.
    </div>
  );
}
