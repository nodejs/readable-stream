"use strict";

/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

var common = require('../common');
var assert = require('assert');
var gcTrackerMap = new WeakMap();
var gcTrackerTag = 'NODE_TEST_COMMON_GC_TRACKER';
function onGC(obj, gcListener) {
  var async_hooks =
  /*require('async_hooks');
  const onGcAsyncHook = async_hooks.createHook({
  init: common.mustCallAtLeast(function(id, type) {
  if (this.trackedId === undefined) {
  assert.strictEqual(type, gcTrackerTag);
  this.trackedId = id;
  }
  }),
  destroy(id) {
  assert.notStrictEqual(this.trackedId, -1);
  if (id === this.trackedId) {
  this.gcListener.ongc();
  onGcAsyncHook.disable();
  }
  }
  }).enable();*/
  onGcAsyncHook.gcListener = gcListener;
  gcTrackerMap.set(obj, new async_hooks.AsyncResource(gcTrackerTag));
  obj = null;
}
module.exports = onGC;
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}