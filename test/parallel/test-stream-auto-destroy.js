"use strict";

/*<replacement>*/
var bufferShim = require('safe-buffer').Buffer;
/*</replacement>*/


var common = require('../common');

var stream = require('../../');

var assert = require('assert/');

{
  var r = new stream.Readable({
    autoDestroy: true,
    read: function read() {
      this.push('hello');
      this.push('world');
      this.push(null);
    },
    destroy: common.mustCall(function (err, cb) {
      return cb();
    })
  });
  var ended = false;
  r.resume();
  r.on('end', common.mustCall(function () {
    ended = true;
  }));
  r.on('close', common.mustCall(function () {
    assert(ended);
  }));
}
{
  var w = new stream.Writable({
    autoDestroy: true,
    write: function write(data, enc, cb) {
      cb(null);
    },
    destroy: common.mustCall(function (err, cb) {
      return cb();
    })
  });
  var finished = false;
  w.write('hello');
  w.write('world');
  w.end();
  w.on('finish', common.mustCall(function () {
    finished = true;
  }));
  w.on('close', common.mustCall(function () {
    assert(finished);
  }));
}
{
  var t = new stream.Transform({
    autoDestroy: true,
    transform: function transform(data, enc, cb) {
      cb(null, data);
    },
    destroy: common.mustCall(function (err, cb) {
      return cb();
    })
  });
  var _ended = false;
  var _finished = false;
  t.write('hello');
  t.write('world');
  t.end();
  t.resume();
  t.on('end', common.mustCall(function () {
    _ended = true;
  }));
  t.on('finish', common.mustCall(function () {
    _finished = true;
  }));
  t.on('close', common.mustCall(function () {
    assert(_ended);
    assert(_finished);
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

_list.forEach(function (e) {
  return process.on('uncaughtException', e);
});