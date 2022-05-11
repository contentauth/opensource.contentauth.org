import React from 'react';
import Link from '@docusaurus/Link';
import CAILogo from '../../assets/images/logo-cai.svg';
import AdobeLogo from '../../assets/images/logo-adobe.svg';
import XIcon from '../../assets/images/x.svg';
import styles from './styles.module.css';

export default function FooterLogoLockup() {
  return (
    <div className={styles.root}>
      <CAILogo className={styles.logoCAI} />
      <XIcon className={styles.x} />
      <AdobeLogo className={styles.logoAdobe} />
    </div>
  );
}
