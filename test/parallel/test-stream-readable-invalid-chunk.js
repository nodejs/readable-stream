"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

var common = require('../common');
var stream = require('../../');
var readable = new stream.Readable({
  read: function read() {}
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
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});