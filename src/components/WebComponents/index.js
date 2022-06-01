import React, { useState, useEffect, useRef } from 'react';
import 'c2pa-wc/dist/components/Icon';
import 'c2pa-wc/dist/components/Indicator';
import 'c2pa-wc/dist/components/Popover';
import 'c2pa-wc/dist/components/panels/ManifestSummary';
import 'c2pa-wc/dist/components/panels/PanelSection';
import './App.css';

export function WebComponents({ imageUrl, provenance, viewMoreUrl }) {
  const [manifest, setManifest] = useState(null);
  const summaryRef = useRef();
  console.log(provenance);
  useEffect(() => {
    let dispose = () => {};
    provenance.manifestStore?.activeManifest
      ?.asSerializable()
      .then((result) => {
        setManifest(result.data);
        dispose = result.dispose;
      });
    return dispose;
  }, [provenance.manifestStore?.activeManifest?.label]);

  useEffect(() => {
    const summaryElement = summaryRef.current;
    if (summaryElement && manifest) {
      summaryElement.manifest = manifest;
      summaryElement.viewMoreUrl = viewMoreUrl;
    }
  }, [summaryRef, manifest]);

  return (
    <div className="web-components">
      <div className="wrapper">
        <img src={imageUrl} />
        {manifest ? (
          <div>
            <cai-popover interactive class="theme-spectrum">
              <cai-indicator slot="trigger"></cai-indicator>
              <cai-manifest-summary
                ref={summaryRef}
                slot="content"
              ></cai-manifest-summary>
            </cai-popover>
          </div>
        ) : null}
      </div>
    </div>
  );
}
