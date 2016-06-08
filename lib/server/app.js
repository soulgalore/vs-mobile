#!/usr/bin/env node

'use strict';

var path = require('path'),
  index = require('./routes/index'),
  result = require('./routes/result'),
  api = require('./routes/api'),
  error = require('./routes/error'),
  help = require('./routes/help'),
  waiting = require('./routes/waiting'),
  bodyParser = require('body-parser'),
  adb = require('./adb'),
  express = require('express')

var serverPort = process.env.SERVER_PORT || 3000,
  app = express();

app.use(bodyParser.urlencoded({
  extended: true
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

var server = app.listen(serverPort, function() {
  console.log('Web app listening at http://%s:%s', server.address().address, server.address().port);
});
