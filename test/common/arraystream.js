"use strict";

/*<replacement>*/
require('babel-polyfill');

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
    Stream = _require.Stream;

var _require2 = require('util'),
    inherits = _require2.inherits;

function noop() {} // A stream to push an array into a REPL


function ArrayStream() {
  this.run = function (data) {
    var _this = this;

    forEach(data, function (line) {
      _this.emit('data', "".concat(line, "\n"));
    });
  };
}

inherits(ArrayStream, Stream);
ArrayStream.prototype.readable = true;
ArrayStream.prototype.writable = true;
ArrayStream.prototype.pause = noop;
ArrayStream.prototype.resume = noop;
ArrayStream.prototype.write = noop;
module.exports = ArrayStream;

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}