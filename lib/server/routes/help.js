'use strict';
const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.render('help');
});
module.exports = router;
