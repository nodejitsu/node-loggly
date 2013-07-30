/*
 * device-test.js: Tests for Loggly device requests
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    helpers = require('./helpers');

var options = {},
    config = helpers.loadConfig(),
    loggly = require('../lib/loggly').createClient(config);

vows.describe('node-loggly/devices').addBatch({
  "When using the node-loggly client": {
    "the getDevices() method": {
      topic: function () {
        loggly.getDevices(this.callback);
      },
      "should return a list of valid devices": function (err, devices) {
        assert.isNull(err);
        devices.forEach(function (device) {
          helpers.assertDevice(device);
        });
      }
    },
    "the addDeviceToInput() method": {
      topic: function () {
        loggly.addDeviceToInput(config.inputs.test.id, '127.0.0.1', this.callback);
      },
      "should respond with 200 status code": function (err, res) {
        assert.isNull(err);
        assert.equal(res.statusCode, 200);

        loggly.removeDevice('127.0.0.1', function(err, res) {
          assert.isNull(err);
          assert.equal(res.statusCode, 204);
        });
      }
    },
    "the removeDevice() method": {
      topic: function () {
        var cb = this.callback;
        loggly.addDeviceToInput(config.inputs.test.id, '127.0.0.2', function(err, res) {
          assert.isNull(err);
          assert.equal(res.statusCode, 200);
          loggly.removeDevice('127.0.0.2', cb);
        });
      },
      "should respond with 204 status code": function (err, res) {
        assert.isNull(err);
        assert.equal(res.statusCode, 204);
      },
      "followed by the getDevices() method": {
        topic: function () {
          loggly.getDevices(this.callback);
        },
        "should not contain the device": function (err, devices) {
          assert.isNull(err);
          devices.forEach(function (device) {
            assert.notEqual(device.ipAddress, '127.0.0.2');
          });
        }
      }
    },
    "the device.remove() method": {
      topic: function () {
        var cb = this.callback;
        loggly.addDeviceToInput(config.inputs.test.id, '127.0.0.3', function(err, res) {
          assert.isNull(err);
          assert.equal(res.statusCode, 200);
          loggly.getDevices(function(err, devices) {
            assert.isNull(err);
            var device = null;
            for (var i=0; i<devices.length; i++) {
              var dev = devices[i];
              if (dev.ip === '127.0.0.3') {
                device = dev;
              }
            }
            assert.isNotNull(device, 'Device should exist');
            device.remove(cb);
          });
        });
      },
      "should respond with 204 status code": function (err, res) {
        assert.isNull(err);
        assert.equal(res.statusCode, 204);
      },
      "followed by the getDevices() method": {
        topic: function () {
          loggly.getDevices(this.callback);
        },
        "should not contain the device": function (err, devices) {
          assert.isNull(err);
          devices.forEach(function (device) {
            assert.notEqual(device.ipAddress, '127.0.0.3');
          });
        }
      }
    }
  }
}).export(module);