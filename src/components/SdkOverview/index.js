import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function SdkOverview() {
  return (
    <figure
      className={styles.figure}
      aria-label={translate({
        id: 'site.sdkOverview.description',
        message: 'Overview of CAI SDK libraries and tools',
      })}
    >
      <div className={styles.scroll} tabIndex={0}>
        <div className={styles.diagram}>
          <svg
            className={styles.connections}
            viewBox="0 0 1094 760"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="sdk-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="currentColor" />
              </marker>
            </defs>
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              markerEnd="url(#sdk-arrow)"
            >
              <path d="M 145 200 V 350" />
              <path d="M 395 220 L 315 350" />
              <path d="M 500 220 L 490 340" />
              <path d="M 630 230 L 700 255" />
              <path d="M 615 275 L 695 350" markerStart="url(#sdk-arrow)" />
              <path d="M 880 225 V 180" markerStart="url(#sdk-arrow)" />
              <path d="M 900 285 V 350" markerStart="url(#sdk-arrow)" />
              <path d="M 130 460 V 530" />
              <path d="M 315 460 L 425 530" />
              <path d="M 490 470 V 530" />
              <path d="M 700 460 L 675 530" />
              <path d="M 900 460 L 710 555" />
              <path d="M 545 640 V 680" />
              <path d="M 720 610 L 775 640" />
            </g>
          </svg>
          <section className={styles.website}>
            <strong>
              <Translate id="site.sdkOverview.website">Website</Translate>
            </strong>
          </section>
          <div className={`${styles.box} ${styles.client}`}>
            <Translate id="site.sdkOverview.client">
              Client JavaScript
            </Translate>
          </div>
          <div className={`${styles.box} ${styles.server}`}>
            <Translate id="site.sdkOverview.server">
              Server code, e.g.
            </Translate>
            <ul>
              <li>Node.js</li>
              <li>Python</li>
              <li>C++/C</li>
            </ul>
          </div>
          <section className={`${styles.box} ${styles.native}`}>
            <strong>
              <Translate id="site.sdkOverview.native">
                Native applications
              </Translate>
            </strong>
            <span>Windows, macOS</span>
            <Translate id="site.sdkOverview.embedded">
              Embedded applications
            </Translate>
          </section>
          <div className={`${styles.box} ${styles.ffi}`}>
            <Translate id="site.sdkOverview.ffi">
              Rust Foreign Function Interface (FFI)*
            </Translate>
          </div>
          <section className={styles.sdk}>
            <strong className={styles.sdkLabel}>
              <Translate id="site.sdkOverview.sdk">CAI SDK</Translate>
            </strong>
          </section>
          <div className={`${styles.box} ${styles.webLibrary}`}>
            <strong>c2pa-web</strong>
            <em>
              <Translate id="site.sdkOverview.javascriptLibrary">
                JavaScript library
              </Translate>
            </em>
          </div>
          <div className={`${styles.box} ${styles.cli}`}>
            <strong>c2patool</strong>
            <em>
              <Translate id="site.sdkOverview.cli">CLI tool</Translate>
            </em>
          </div>
          <div className={`${styles.box} ${styles.bindings}`}>
            <strong>c2pa-cpp</strong>
            <strong>c2pa-python</strong>
            <strong>c2pa-node</strong>
          </div>
          <div className={`${styles.box} ${styles.mobile}`}>
            <strong>c2pa-ios</strong>
            <strong>c2pa-android</strong>
          </div>
          <div className={`${styles.box} ${styles.rust}`}>
            <strong>c2pa-rs</strong>
            <em>
              <Translate id="site.sdkOverview.rustLibrary">
                Rust library
              </Translate>
            </em>
          </div>
          <div className={`${styles.output} ${styles.view}`}>
            <Translate id="site.sdkOverview.view">
              View Content Credentials
            </Translate>
          </div>
          <div className={`${styles.output} ${styles.modify}`}>
            <Translate id="site.sdkOverview.modify">
              View, create, and modify Content Credentials
            </Translate>
          </div>
          <div className={`${styles.box} ${styles.asset}`}>
            <Translate id="site.sdkOverview.asset">
              Embedded in asset file
            </Translate>
          </div>
          <div className={`${styles.box} ${styles.cloud}`}>
            <span>Adobe Content Credentials Cloud</span>
            <small>
              <Translate id="site.sdkOverview.adobeTools">
                (For Adobe tools)
              </Translate>
            </small>
          </div>
          <small className={styles.note}>
            <Translate id="site.sdkOverview.ffiNote">
              *If needed, depending on the host application's native language.
            </Translate>
          </small>
        </div>
      </div>
    </figure>
  );
}
