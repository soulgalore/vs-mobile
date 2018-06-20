'use strict';
const express = require('express');
const uuid = require('node-uuid');
const adb = require('../adb');
const data = require('../data');
const queues = require('../queue');
const router = new express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    devices: '/api/devices',
    runTest:
      '/api/run?url=https://en.m.wikipedia.org/wiki/Barack_Obama&iterations=1&deviceId=ID',
    getResult: '/api/result/ID'
  });
});

router.get('/devices', (req, res) => {
  adb.getPhones().then(devices => {
    res.json({
      devices
    });
  });
});

router.get('/run/', (req, res) => {
  const url = req.query.url || '';
  const iterations = req.query.iterations || 1;
  const deviceId = req.query.deviceId || '';
  const id = uuid.v4();

  if (url === '' || deviceId === '') {
    /* eslint prefer-template: "off"*/
    const reason =
      'Missing request parameter ' + (url === '' ? 'url' : 'deviceId');
    res.json({
      status: 'error',
      reason
    });
  } else {
    const config = {
      url,
      iterations,
      deviceId,
      id
    };
    queues[deviceId](config);
    data[id] = {
      status: 'waiting',
      deviceId,
      url
    };
    res.json({
      id
    });
  }
});

router.get('/result/:id', (req, res) => {
  const id = req.params.id;
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
