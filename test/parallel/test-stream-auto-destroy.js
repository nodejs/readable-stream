"use strict";

/*<replacement>*/
const bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/
const common = require('../common');
const stream = require('../../');
const assert = require('assert/');
{
  const r = new stream.Readable({
    autoDestroy: true,
    read() {
      this.push('hello');
      this.push('world');
      this.push(null);
    },
    destroy: common.mustCall((err, cb) => cb())
  });
  let ended = false;
  r.resume();
  r.on('end', common.mustCall(() => {
    ended = true;
  }));
  r.on('close', common.mustCall(() => {
    assert(ended);
  }));
}
{
  const w = new stream.Writable({
    autoDestroy: true,
    write(data, enc, cb) {
      cb(null);
    },
    destroy: common.mustCall((err, cb) => cb())
  });
  let finished = false;
  w.write('hello');
  w.write('world');
  w.end();
  w.on('finish', common.mustCall(() => {
    finished = true;
  }));
  w.on('close', common.mustCall(() => {
    assert(finished);
  }));
}
{
  const t = new stream.Transform({
    autoDestroy: true,
    transform(data, enc, cb) {
      cb(null, data);
    },
    destroy: common.mustCall((err, cb) => cb())
  });
  let ended = false;
  let finished = false;
  t.write('hello');
  t.write('world');
  t.end();
  t.resume();
  t.on('end', common.mustCall(() => {
    ended = true;
  }));
  t.on('finish', common.mustCall(() => {
    finished = true;
  }));
  t.on('close', common.mustCall(() => {
    assert(ended);
    assert(finished);
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