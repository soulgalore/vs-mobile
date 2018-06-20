'use strict';
const adb = require('adbkit');
const client = adb.createClient();
const queues = require('./queue');
const Promise = require('bluebird');
const run = require('./run');
const data = require('./data');
const log = require('intel');
const cq = require('concurrent-queue');

function setupQueue(id) {
  if (!queues[id]) {
    log.info('Setup queue for %s', id);
    queues[id] = cq()
      .limit({
        concurrency: 1
      })
      .process(task => {
        const runId = task.id;
        data[runId].status = 'working';
        return run(task.url, task.iterations, task.device)
          .then(result => {
            data[runId] = {
              status: 'ok',
              result
            };
          })
          .catch(reason => {
            data[runId] = {
              status: 'failed',
              reason
            };
          });
      });
  }
}

module.exports = {
  getPhones() {
    /* eslint prefer-arrow-callback: "off"*/
    return client.listDevices().then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.getProperties(device.id).then(function(prop) {
          return {
            id: device.id,
            model: prop['ro.product.model']
          };
        });
      });
    });
  },
  setup() {
    client
      .trackDevices()
      .then(tracker => {
        tracker.on('add', device => {
          log.info('Device %s was plugged in', device.id);
          setupQueue(device.id);
        });
        tracker.on('remove', device => {
          log.info('Device %s was unplugged', device.id);
        });
      })
      .catch(err => {
        log.error('Something went wrong:', err.stack);
      });
  }
};
