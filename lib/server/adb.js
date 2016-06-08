'use strict';

var adb = require('adbkit'),
  client = adb.createClient(),
  queues = require('./queue'),
  Promise = require('bluebird'),
  run = require('./run'),
  data = require('./data'),
  cq = require('concurrent-queue');

function setupQueue(id) {
  if (!queues[id]) {
    console.log('Setup queue for ' + id);
    queues[id] = cq().limit({
      concurrency: 1
    }).process(function(task) {
      var runId = task.id;
      data[runId].status = 'working';
      return run(task.url, task.iterations, task.device).then(function(result) {
        data[runId] = {
          status: 'ok',
          result: result
        };
      }).catch(function(reason) {
        data[runId] = {
          status: 'failed',
          reason: reason
        }
      })
    });
  }
}

module.exports = {
  getPhones() {
    return client.listDevices().then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.getProperties(device.id).then(function(prop) {
          return {
            id: device.id,
            model: prop['ro.product.model']
          };
        })
      });
    });
  },
  setup() {
    client.trackDevices().then(function(tracker) {
      tracker.on('add', function(device) {
        console.log('Device %s was plugged in', device.id)
        setupQueue(device.id);
      })
      tracker.on('remove', function(device) {
        console.log('Device %s was unplugged', device.id)
      })
    }).catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })
  }
}
