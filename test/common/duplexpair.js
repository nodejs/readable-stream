"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/

/* eslint-disable node-core/required-modules */


'use strict';
/*<replacement>*/


var objectKeys = objectKeys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var _require = require('../../'),
    Duplex = _require.Duplex;

var assert = require('assert');

var kCallback = Symbol('Callback');
var kOtherSide = Symbol('Other');

var DuplexSocket =
/*#__PURE__*/
function (_Duplex) {
  _inheritsLoose(DuplexSocket, _Duplex);

  function DuplexSocket() {
    var _this;

    _this = _Duplex.call(this) || this;
    _this[kCallback] = null;
    _this[kOtherSide] = null;
    return _this;
  }

  var _proto = DuplexSocket.prototype;

  _proto._read = function _read() {
    var callback = this[kCallback];

    if (callback) {
      this[kCallback] = null;
      callback();
    }
  };

  _proto._write = function _write(chunk, encoding, callback) {
    assert.notStrictEqual(this[kOtherSide], null);
    assert.strictEqual(this[kOtherSide][kCallback], null);
    this[kOtherSide][kCallback] = callback;
    this[kOtherSide].push(chunk);
  };

  _proto._final = function _final(callback) {
    this[kOtherSide].on('end', callback);
    this[kOtherSide].push(null);
  };

  return DuplexSocket;
}(Duplex);

function makeDuplexPair() {
  var clientSide = new DuplexSocket();
  var serverSide = new DuplexSocket();
  clientSide[kOtherSide] = serverSide;
  serverSide[kOtherSide] = clientSide;
  return {
    clientSide: clientSide,
    serverSide: serverSide
  };
}

module.exports = makeDuplexPair;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}