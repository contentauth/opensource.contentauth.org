// Redirects /docs route to /docs/introduction
import React from 'react';
import { Redirect } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Home = () => {
  return <Redirect to={useBaseUrl('/docs/introduction')} />;
};

export default Home;
