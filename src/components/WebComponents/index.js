import { createL2ManifestStore } from 'c2pa';
import 'c2pa-wc/dist/components/Icon';
import 'c2pa-wc/dist/components/Indicator';
import 'c2pa-wc/dist/components/ManifestSummary';
import 'c2pa-wc/dist/components/PanelSection';
import 'c2pa-wc/dist/components/Popover';
import React, { useEffect, useRef, useState } from 'react';
import './styles.css';

export function WebComponents({ imageUrl, provenance, viewMoreUrl }) {
  console.log('imageUrl', imageUrl);
  const [manifestStore, setManifestStore] = useState(null);
  const summaryRef = useRef();

  useEffect(() => {
    let disposeFn = () => {};

    if (!provenance.manifestStore?.activeManifest) {
      return;
    }

    createL2ManifestStore(provenance.manifestStore).then(
      ({ manifestStore, dispose }) => {
        setManifestStore(manifestStore);
        disposeFn = dispose;
      },
    );

    return disposeFn;
  }, [provenance.manifestStore?.activeManifest]);

  useEffect(() => {
    const summaryElement = summaryRef.current;
    if (summaryElement && manifestStore) {
      summaryElement.manifestStore = manifestStore;
      summaryElement.viewMoreUrl = viewMoreUrl;
    }
  }, [summaryRef, manifestStore]);

  return (
    <div className="web-components">
      <div className="wrapper">
        <img src={imageUrl} />
        {manifestStore ? (
          <div>
            <cai-popover
              interactive
              class="theme-spectrum"
              strategy="fixed"
              placement="left-start"
            >
              <cai-indicator slot="trigger"></cai-indicator>
              <cai-manifest-summary
                ref={summaryRef}
                slot="content"
                class="theme-spectrum"
              ></cai-manifest-summary>
            </cai-popover>
          </div>
        ) : null}
      </div>
    </div>
  );
}
