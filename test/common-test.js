/*
 * common-test.js: Tests for Loggly `common` utility module
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    common = require('../lib/loggly/common');

vows.describe('node-loggly/common').addBatch({
  "When using the common module": {
    "the clone() method": {
      topic: function () {
        this.obj = {
          name: 'common',
          deep: {
            first: 'first',
            second: 'second'
          }
        };
        return common.clone(this.obj);
      },
      "should return a deep clone of the object": function (clone) {
        assert.isFalse(this.obj.deep === clone.deep);
      }
    },

    "the serialize() method": {
      topic: function () {
        this.obj = {
          name: 'cyclical',
        };

        this.obj.cycle = this.obj;
        return common.serialize(this.obj);
      },
      "should handle objects containing cyclical references": function (serialized) {
        assert.equal("name=cyclical, cycle=<Circular>", serialized);
      }
    }
  }
}).export(module);