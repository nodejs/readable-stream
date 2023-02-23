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

// Hijack stdout and stderr
const stdWrite = {};
function hijackStdWritable(name, listener) {
  const stream = process[name];
  const _write = stdWrite[name] = stream.write;
  stream.writeTimes = 0;
  stream.write = function (data, callback) {
    try {
      listener(data);
    } catch (e) {
      process.nextTick(() => {
        throw e;
      });
    }
    _write.call(stream, data, callback);
    stream.writeTimes++;
  };
}
function restoreWritable(name) {
  process[name].write = stdWrite[name];
  delete process[name].writeTimes;
}
module.exports = {
  hijackStdout: hijackStdWritable.bind(null, 'stdout'),
  hijackStderr: hijackStdWritable.bind(null, 'stderr'),
  restoreStdout: restoreWritable.bind(null, 'stdout'),
  restoreStderr: restoreWritable.bind(null, 'stderr')
};
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}