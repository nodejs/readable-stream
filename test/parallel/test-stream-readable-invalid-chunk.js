"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const stream = require('../../');
const readable = new stream.Readable({
  read: () => {}
});
function checkError(fn) {
  common.expectsError(fn, {
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError
  });
}
checkError(() => readable.push([]));
checkError(() => readable.push({}));
checkError(() => readable.push(0));
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));