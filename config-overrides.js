const { override } = require('customize-cra');

module.exports = override((config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'process': require.resolve('process/browser'),
  };

  // Set Puppeteer launch options to include --no-sandbox
  process.env.PUPPETEER_SKIP_DOWNLOAD = 'true'; // Skip Puppeteer download if needed
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.userOptions = {
        ...plugin.userOptions,
        // Add any other options you need here
      };
    }
  });

  return config;
});

