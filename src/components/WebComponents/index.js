// import { useState, useEffect, useRef } from 'react';
// import { useC2pa, useThumbnailUrl } from '@contentauth/react-hooks';
// import 'c2pa-wc/dist/components/Icon';
// import 'c2pa-wc/dist/components/Indicator';
// import 'c2pa-wc/dist/components/Popover';
// import 'c2pa-wc/dist/components/panels/ManifestSummary';
// import 'c2pa-wc/dist/components/panels/PanelSection';
// import { ManifestSummary } from 'c2pa-wc/dist/components/panels/ManifestSummary';
// import './App.css';
// import sampleImage from '../assets/CAICAI.jpg?url';
// import {
//   C2paReadResult,
//   generateVerifyUrl,
//   Manifest,
//   SerializableManifestData,
// } from 'c2pa';
// import { Resolvers } from './main';

// function WebComponents({ imageUrl, provenance, viewMoreUrl }) {
//   const [manifest, setManifest] = useState(null);
//   const summaryRef = useRef(ManifestSummary);

//   useEffect(() => {
//     let dispose = () => {};
//     provenance.manifestStore?.activeManifest
//       ?.asSerializable()
//       .then((result) => {
//         setManifest(result.data);
//         dispose = result.dispose;
//       });
//     return dispose;
//   }, [provenance.manifestStore?.activeManifest.label]);

//   useEffect(() => {
//     const summaryElement = summaryRef.current;
//     if (summaryElement && manifest) {
//       summaryElement.manifest = manifest;
//       summaryElement.viewMoreUrl = viewMoreUrl;
//     }
//   }, [summaryRef, manifest]);

//   return (
//     <div className="web-components">
//       <div className="wrapper">
//         <img src={imageUrl} />
//         {manifest ? (
//           <div>
//             <cai-popover interactive class="theme-spectrum">
//               <cai-indicator slot="trigger"></cai-indicator>
//               <cai-manifest-summary
//                 ref={summaryRef}
//                 slot="content"
//               ></cai-manifest-summary>
//             </cai-popover>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }
