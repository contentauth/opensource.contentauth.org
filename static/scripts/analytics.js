(function () {
  // Configure marketing tech - Make sure this is done
  // prior to initializing the marketing tech lib script
  window.marketingtech = {
    adobe: {
      launch: {
        property: 'global',
        // Environment: "dev" for local, "production" for prod/live site,
        // "stage" for qa/staging site
        environment: 'production',
      },
      analytics: {
        // Additional Accounts: if there are any additional report suites send
        // values with "," separated  Ex: "RS1,RS2"
        // additionalAccounts: ' ',
      },
      // Target: if target needs to be enabled else false
      target: true,
      // Audience Manager: if audience manager needs to be enabled else false
      audienceManager: true,
    },
  };
})();
