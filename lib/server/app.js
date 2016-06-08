#!/usr/bin/env node
'use strict';
const path = require('path');
const index = require('./routes/index');
const result = require('./routes/result');
const api = require('./routes/api');
const error = require('./routes/error');
const help = require('./routes/help');
const waiting = require('./routes/waiting');
const bodyParser = require('body-parser');
const adb = require('./adb');
const log = require('intel');
const express = require('express');

const serverPort = process.env.SERVER_PORT || 3000;
const app = express();

log.basicConfig({
  format: '[%(date)s] %(message)s',
  level: log.INFO,
});


app.use(bodyParser.urlencoded({
  extended: true,
})); // support encoded bodies
app.set('json spaces', 2);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/', index);
app.use('/result/', result);
app.use('/waiting/', waiting);
app.use('/failing/', error);
app.use('/help/', help);
app.use('/api/', api);

app.use('/css', express.static(path.join(__dirname, 'static', 'css')));
app.use('/js', express.static(path.join(__dirname, 'static', 'js')));
app.use('/har', express.static(path.join(__dirname, 'har')));

adb.setup();

const server = app.listen(serverPort, () => {
  log.info('Web app listening at http://%s:%s', server.address().address, server.address().port);
});
