'use strict';
const express = require('express');
const data = require('../data');
const router = new express.Router();

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.render('error', {
    reason: data[id].reason
  });
});
module.exports = router;
