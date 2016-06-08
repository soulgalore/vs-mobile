'use strict';

var express = require('express'),
  data = require('../data'),
  path = require('path'),
  fs = require('fs'),
  ttest = require('ttest'),
  router = express.Router();

function writeHar(id, har) {
  fs.writeFile(path.join(__dirname, '..', 'har', id + '.har'), JSON.stringify(har), 'utf8', function(err) {
    if (err)
      return console.log(err);
  });
}

function addFirstPaint(result) {
  // hack for getting first paint in the waterfall
  var i = 0;
  result.result.browserScripts.forEach(function(run) {
    if (run.timings.firstPaint !== undefined) {
      result.result.har.log.pages[i].pageTimings._firstPaint = run.timings.firstPaint.toFixed(0);
    }
    i++;
  });
}

router.get('/:id', function(req, res) {
  var id = req.params.id;

  addFirstPaint(data[id]);

  if (data[id]) {
    res.render('result', {
      result: data[id].result,
      id: id,
      har: data[id].result.har
    });
  }
  writeHar(id, data[id].result.har);
});

router.get('/:id/:id2', function(req, res) {
  var id = req.params.id,
    id2 = req.params.id2;

  var url1 = [],
    url2 = [];
  data[id].result.browserScripts.forEach(function(run) {
    if (run.timings.firstPaint !== undefined)
      url1.push(run.timings.firstPaint)
  });
  data[id2].result.browserScripts.forEach(function(run) {
    if (run.timings.firstPaint !== undefined)
      url2.push(run.timings.firstPaint)
  });


  if (data[id] && data[id2]) {
    addFirstPaint(data[id]);
    addFirstPaint(data[id2]);
    res.render('resultvs', {
      results: [{
        id,
        result: data[id].result,
        har: data[id].result.har
      }, {
        id: id2,
        result: data[id2].result,
        har: data[id2].result.har
      }]
    });
    writeHar(id, data[id].result.har);
    writeHar(id2, data[id2].result.har);
  }
});

module.exports = router;
