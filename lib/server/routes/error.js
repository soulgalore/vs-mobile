'use strict';

var express = require('express'),
  data = require('../data'),
  router = express.Router();

router.get('/:id', function(req, res) {
  var id = req.params.id;
  res.render('error', {
    reason: data[id].reason
  });
});
module.exports = router;
