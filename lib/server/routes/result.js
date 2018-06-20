'use strict';
const express = require('express');
const data = require('../data');
const path = require('path');
const fs = require('fs');
const log = require('intel');
const router = new express.Router();

function writeHar(id, har) {
  fs.writeFile(
    path.join(__dirname, '..', 'har', `${id}.har`),
    JSON.stringify(har),
    'utf8',
    err => {
      if (err) {
        log.error(err);
      }
    }
  );
}

function addFirstPaint(result) {
  // hack for getting first paint in the waterfall
  let i = 0;
  result.result.browserScripts.forEach(run => {
    if (run.timings.firstPaint !== undefined) {
      /* eslint no-underscore-dangle: "off", no-param-reassign: "off" */
      result.result.har.log.pages[
        i
      ].pageTimings._firstPaint = run.timings.firstPaint.toFixed(0);
    }
    i++;
  });
}

router.get('/:id', (req, res) => {
  const id = req.params.id;

  addFirstPaint(data[id]);

  if (data[id]) {
    res.render('result', {
      result: data[id].result,
      id,
      har: data[id].result.har
    });
  }
  writeHar(id, data[id].result.har);
});

router.get('/:id/:id2', (req, res) => {
  const id = req.params.id;
  const id2 = req.params.id2;
  const url1 = [];
  const url2 = [];
  data[id].result.browserScripts.forEach(run => {
    if (run.timings.firstPaint !== undefined) {
      url1.push(run.timings.firstPaint);
    }
  });
  data[id2].result.browserScripts.forEach(run => {
    if (run.timings.firstPaint !== undefined) {
      url2.push(run.timings.firstPaint);
    }
  });

  if (data[id] && data[id2]) {
    addFirstPaint(data[id]);
    addFirstPaint(data[id2]);
    res.render('resultvs', {
      results: [
        {
          id,
          result: data[id].result,
          har: data[id].result.har
        },
        {
          id: id2,
          result: data[id2].result,
          har: data[id2].result.har
        }
      ]
    });
    writeHar(id, data[id].result.har);
    writeHar(id2, data[id2].result.har);
  }
});

module.exports = router;
