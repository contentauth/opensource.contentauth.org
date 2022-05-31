// import { useThumbnailUrl } from '@contentauth/react-hooks';
// import 'c2pa-wc/dist/components/Icon';
// import 'c2pa-wc/dist/components/Indicator';
// import 'c2pa-wc/dist/components/Popover';
// import 'c2pa-wc/dist/components/panels/ManifestSummary';
// import 'c2pa-wc/dist/components/panels/PanelSection';
// import './App.css';

// function ManifestInfo({ manifest, viewMoreUrl }) {
//   const thumbnailUrl = useThumbnailUrl(manifest?.thumbnail);
//   const producer = manifest?.producer;

//   return (
//     <table className="claim-info">
//       <tbody>
//         {thumbnailUrl ? (
//           <tr>
//             <td colSpan={2}>
//               <img src={thumbnailUrl} style={{ width: 250, height: 'auto' }} />
//             </td>
//           </tr>
//         ) : null}
//         {producer ? (
//           <tr>
//             <td>Producer</td>
//             <td>{producer.name}</td>
//           </tr>
//         ) : null}
//         <tr>
//           <td>Produced with</td>
//           <td>{manifest.claimGenerator.value}</td>
//         </tr>
//         <tr>
//           <td>Signed by</td>
//           <td>{manifest.signature.issuer}</td>
//         </tr>
//         <tr>
//           <td>Signed on</td>
//           <td>{manifest.signature.date?.toLocaleString()}</td>
//         </tr>
//         <tr>
//           <td>Number of ingredients</td>
//           <td>{manifest.ingredients?.length}</td>
//         </tr>
//         <tr>
//           <td colSpan={2}>
//             <a href={viewMoreUrl} target="_blank">
//               View more
//             </a>
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   );
// }
