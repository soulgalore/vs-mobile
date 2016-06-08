'use strict';
var browsertime = require('browsertime'),
  scriptCategories = browsertime.browserScripts.allScriptCategories,
  scriptsByCategory = browsertime.browserScripts.getScriptsForCategories(scriptCategories);

var run = function(url, iterations, device) {
  console.log('Will analyze url ' + url + ' ' + iterations + ' times');
  // use native HAR to
  var options = {
    silent: true,
    browser: 'chrome',
    chrome: {
      android: {
        package: 'com.android.chrome',
        deviceSerial: device
      }
    },
    statistics: true,
    experimental: {
      nativeHar: true
    },
    iterations: Number(iterations)
  };

  var engine = new browsertime.Engine(options);

  return engine.start().then(() => engine.run(url, scriptsByCategory).finally(() => engine.stop()));
}

module.exports = run;
