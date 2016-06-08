'use strict';

var express = require('express'),
  run = require('../run'),
  uuid = require('node-uuid'),
  adb = require('../adb'),
  data = require('../data'),
  queues = require('../queue'),
  router = express.Router();

router.get('/', function(req, res) {
  res.json({
    message: 'Welcome to the API',
    devices: '/api/devices',
    runTest: '/api/run?url=https://en.m.wikipedia.org/wiki/Barack_Obama&iterations=1&deviceId=ID',
    getResult: '/api/result/ID'
  });
});

router.get('/devices', function(req, res) {
  adb.getPhones().then(function(devices) {
    res.json({
      devices: devices
    });
  })
});

router.get('/run/', function(req, res) {
  var url = req.query.url || '',
    iterations = req.query.iterations || 1,
    deviceId = req.query.deviceId || '',
    id = uuid.v4();

  if (url === '' || deviceId === '') {
    var reason = 'Missing request paremeter ' + ((url === '') ?
      'url' :
      'deviceId');
    res.json({
      status: 'error',
      reason: reason
    });
  } else {
    var config = {
      url: url,
      iterations: iterations,
      deviceId: deviceId,
      id: id
    };
    queues[deviceId](config);
    data[id] = {
      status: 'waiting',
      deviceId: deviceId,
      url: url
    };
    res.json({
      id: id
    });
  }
});

router.get('/result/:id', function(req, res) {
  var id = req.params.id;
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);

  if (data[id].status === 'working' || data[id].status === 'waiting') {
    res.json({
      status: data[id].status
    });
  } else if (data[id].status === 'ok') {
    res.json({
      result: data[id],
      status: 'ok'
    });
  } else {
    res.json({
      status: 'The id is completely wrong'
    });
  }
});

module.exports = router;
