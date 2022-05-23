(function () {
  // Check if window is defined because build fails on
  // server on client modules.
  // See: https://github.com/facebook/docusaurus/issues/4268
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        // Environment: "dev" for local “production” for prod/live site or
        // “stage” for qa/staging site
        environment:
          process.env.NODE_ENV === 'production' ? 'production' : 'dev',
      },
      analytics: {
        // Additional Accounts: if there are any additional report suites send
        // values with “,” separated  Ex: “RS1,RS2”
        // additionalAccounts: ' ',
      },
      // Target: if target needs to be enabled else false
      target: true,
      // Audience Manager: if audience manager needs to be enabled else false
      audienceManager: true,
    },
  };
})();
