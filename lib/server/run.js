'use strict';
const browsertime = require('browsertime');


const run = async function run(url, iterations, device) {
  const scriptCategories = await browsertime.browserScripts.allScriptCategories;
  const scriptsByCategory = await browsertime.browserScripts.getScriptsForCategories(scriptCategories);

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
  let result;
  await engine.start();
  try {
    result = await engine.run(url, scriptsByCategory);
  } finally {
    await engine.stop();
  }
  return result;
};

module.exports = run;
