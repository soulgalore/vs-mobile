'use strict';

var express = require('express'),
  data = require('../data'),
  queue = require('../queue'),
  router = express.Router();

router.get('/:id/:id2', function(req, res) {
  var id = req.params.id;
  var id2 = req.params.id2;
  if (data[id].status === 'working' || data[id].status === 'waiting') {
    res.render('waiting', {
      url: data[id].url,
      status: data[id].status,
      queueSize: queue[data[id].deviceId].size
    });
  } else if (data[id].status === 'failed') {
    res.redirect('/failing/' + id);
  } else if (data[id].status === 'ok') {
    if (data[id2].status === 'ok') {
      res.redirect('/result/' + id + '/' + id2);
    } else {
      res.render('waiting', {
        url: data[id2].url,
        status: data[id2].status,
        queueSize: queue[data[id2].deviceId].size
      });
    }
  }
});

router.get('/:id', function(req, res) {
  var id = req.params.id;
  if (data[id].status === 'working' || data[id].status === 'waiting') {
    res.render('waiting', {
      url: data[id].url,
      status: data[id].status,
      queueSize: queue[data[id].deviceId].size
    });
  } else if (data[id].status === 'failed') {
    res.redirect('/failing/' + id);
  } else if (data[id].status === 'ok') {
    res.redirect('/result/' + id);
  }
});

module.exports = router;
