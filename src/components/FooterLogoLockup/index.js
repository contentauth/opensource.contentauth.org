import React from 'react';
import Link from '@docusaurus/Link';
//import CAILogo from '../../assets/images/logo-cai.svg';
//import AdobeLogo from '../../assets/images/logo-adobe.svg';
//import XIcon from '../../assets/images/x.svg';
import styles from './styles.module.css';

export default function FooterLogoLockup() {
  return (
    <div className={styles.root}>
      <a href="https://contentauthenticity.org/" target="_blank"></a>

      <a href="https://www.adobe.com/" target="_blank"></a>
    </div>
  );
}
