"use strict";

/*<replacement>*/
require('@babel/polyfill');
var util = require('util');
for (var i in util) exports[i] = util[i];
/*</replacement>*/ /* eslint-disable node-core/required-modules */
'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};
/*</replacement>*/

const _require = require('../../'),
  Duplex = _require.Duplex;
const assert = require('assert');
const kCallback = Symbol('Callback');
const kOtherSide = Symbol('Other');
class DuplexSocket extends Duplex {
  constructor() {
    super();
    this[kCallback] = null;
    this[kOtherSide] = null;
  }
  _read() {
    const callback = this[kCallback];
    if (callback) {
      this[kCallback] = null;
      callback();
    }
  }
  _write(chunk, encoding, callback) {
    assert.notStrictEqual(this[kOtherSide], null);
    assert.strictEqual(this[kOtherSide][kCallback], null);
    this[kOtherSide][kCallback] = callback;
    this[kOtherSide].push(chunk);
  }
  _final(callback) {
    this[kOtherSide].on('end', callback);
    this[kOtherSide].push(null);
  }
}
function makeDuplexPair() {
  const clientSide = new DuplexSocket();
  const serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return {
    clientSide,
    serverSide
  };
}
module.exports = makeDuplexPair;
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}