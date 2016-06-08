'use strict';

var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  data = require('../data'),
  queues = require('../queue'),
  adb = require('../adb');

router.get('/', function(req, res) {

  adb.getPhones().then(function(devices) {
    if (devices.length > 0) {
      res.render('index', {
        devices: devices
      });
    } else {
      res.render('missingphone');
    }
  })
});

router.post('/', function(req, res) {

  var urls = req.body.url,
    iterations = req.body.iterations || 1,
    deviceId = req.body.deviceId || '',
    text = '';

  urls.forEach(function(url) {
    if (url !== '') {
      var id = uuid.v4();
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
      text = text + '/' + id;
    }
  });
  res.redirect('/waiting/' + text);
});

module.exports = router;
