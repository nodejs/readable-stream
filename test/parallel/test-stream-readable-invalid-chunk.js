/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var stream = require('../../');

var readable = new stream.Readable({
  read: function () {}
});

function checkError(fn) {
  common.expectsError(fn, {
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError
  });
}

checkError(function () {
  return readable.push([]);
});
checkError(function () {
  return readable.push({});
});
checkError(function () {
  return readable.push(0);
});
;require('tap').pass('sync run');