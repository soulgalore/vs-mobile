'use strict';
const browsertime = require('browsertime');
const scriptCategories = browsertime.browserScripts.allScriptCategories;
const scriptsByCategory = browsertime.browserScripts.getScriptsForCategories(scriptCategories);

const run = function run(url, iterations, device) {
  // use native HAR to
  const options = {
    silent: true,
    browser: 'chrome',
    chrome: {
      android: {
        package: 'com.android.chrome',
        deviceSerial: device,
      },
    },
    statistics: true,
    experimental: {
      nativeHar: true,
    },
    iterations: Number(iterations),
  };

  const engine = new browsertime.Engine(options);

  return engine.start().then(() => engine.run(url, scriptsByCategory).finally(() => engine.stop()));
};

module.exports = run;
