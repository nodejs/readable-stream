'use strict';

import { promisify } from "util";
import _fs from "fs";
import _assert from "assert";
import { Writable, Readable, Transform, finished } from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const assert = _assert;
const fs = _fs;
{
  const rs = new Readable({
    read() {}

  });
  finished(rs, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  rs.push(null);
  rs.resume();
}
{
  const ws = new Writable({
    write(data, enc, cb) {
      cb();
    }

  });
  finished(ws, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  ws.end();
}
{
  const tr = new Transform({
    transform(data, enc, cb) {
      cb();
    }

  });
  let finish = false;
  let ended = false;
  tr.on('end', () => {
    ended = true;
  });
  tr.on('finish', () => {
    finish = true;
  });
  finished(tr, common.mustCall(err => {
    assert(!err, 'no error');
    assert(finish);
    assert(ended);
  }));
  tr.end();
  tr.resume();
}
{
  const rs = fs.createReadStream(__filename);
  rs.resume();
  finished(rs, common.mustCall());
}
{
  const finishedPromise = promisify(finished);

  async function run() {
    const rs = fs.createReadStream(__filename);
    const done = common.mustCall();
    let ended = false;
    rs.resume();
    rs.on('end', () => {
      ended = true;
    });
    await finishedPromise(rs);
    assert(ended);
    done();
  }

  run();
}
{
  const rs = fs.createReadStream('file-does-not-exist');
  finished(rs, common.mustCall(err => {
    assert.strictEqual(err.code, 'ENOENT');
  }));
}
{
  const rs = new Readable();
  finished(rs, common.mustCall(err => {
    assert(!err, 'no error');
  }));
  rs.push(null);
  rs.emit('close'); // should not trigger an error

  rs.resume();
}
{
  const rs = new Readable();
  finished(rs, common.mustCall(err => {
    assert(err, 'premature close error');
  }));
  rs.emit('close'); // should trigger error

  rs.push(null);
  rs.resume();
} // Test that calling returned function removes listeners

{
  const ws = new Writable({
    write(data, env, cb) {
      cb();
    }

  });
  const removeListener = finished(ws, common.mustNotCall());
  removeListener();
  ws.end();
}
{
  const rs = new Readable();
  const removeListeners = finished(rs, common.mustNotCall());
  removeListeners();
  rs.emit('close');
  rs.push(null);
  rs.resume();
}
export default module.exports;