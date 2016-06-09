'use strict';
const express = require('express');
const router = new express.Router();
const uuid = require('node-uuid');
const data = require('../data');
const queues = require('../queue');
const adb = require('../adb');

router.get('/', (req, res) => {
  adb.getPhones().then(devices => {
    if (devices.length > 0) {
      res.render('index', {
        devices,
      });
    } else {
      res.render('missingphone');
    }
  });
});

router.post('/', (req, res) => {
  const urls = req.body.url;
  const iterations = req.body.iterations || 1;
  const deviceId = req.body.deviceId || '';
  let text = '';

  urls.forEach(url => {
    if (url !== '') {
      const id = uuid.v4();
      const config = {
        url,
        iterations,
        deviceId,
        id,
      };
      queues[deviceId](config);

      data[id] = {
        status: 'waiting',
        deviceId,
        url,
      };
      text = `${text}/${id}`;
    }
  });
  res.redirect(`/waiting/${text}`);
});

module.exports = router;
