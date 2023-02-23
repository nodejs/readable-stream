"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/

const common = require('../common');
const assert = require('assert/');
const _require = require('../../'),
  Readable = _require.Readable,
  Writable = _require.Writable;

// This test ensures that if have 'readable' listener
// on Readable instance it will not disrupt the pipe.

{
  let receivedData = '';
  const w = new Writable({
    write: (chunk, env, callback) => {
      receivedData += chunk;
      callback();
    }
  });
  const data = ['foo', 'bar', 'baz'];
  const r = new Readable({
    read: () => {}
  });
  r.once('readable', common.mustCall());
  r.pipe(w);
  r.push(data[0]);
  r.push(data[1]);
  r.push(data[2]);
  r.push(null);
  w.on('finish', common.mustCall(() => {
    assert.strictEqual(receivedData, data.join(''));
  }));
}
{
  let receivedData = '';
  const w = new Writable({
    write: (chunk, env, callback) => {
      receivedData += chunk;
      callback();
    }
  });
  const data = ['foo', 'bar', 'baz'];
  const r = new Readable({
    read: () => {}
  });
  r.pipe(w);
  r.push(data[0]);
  r.push(data[1]);
  r.push(data[2]);
  r.push(null);
  r.once('readable', common.mustCall());
  w.on('finish', common.mustCall(() => {
    assert.strictEqual(receivedData, data.join(''));
  }));
}
;
(function () {
  var t = require('tap');
  t.pass('sync run');
})();
var _list = process.listeners('uncaughtException');
process.removeAllListeners('uncaughtException');
_list.pop();
_list.forEach(e => process.on('uncaughtException', e));