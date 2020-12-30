'use strict';

import _assert from "assert";
import _readableDenoJs from "../../readable-deno.js";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
const common = _commonDenoJs;
const stream = _readableDenoJs;
const assert = _assert;
const readable = new stream.Readable({
  read: () => {}
});
const writables = [];

for (let i = 0; i < 5; i++) {
  const target = new stream.Writable({
    write: common.mustCall((chunk, encoding, callback) => {
      target.output.push(chunk);
      callback();
    }, 1)
  });
  target.output = [];
  target.on('pipe', common.mustCall());
  readable.pipe(target);
  writables.push(target);
}

const input = Buffer.from([1, 2, 3, 4, 5]);
readable.push(input); // The pipe() calls will postpone emission of the 'resume' event using nextTick,
// so no data will be available to the writable streams until then.

process.nextTick(common.mustCall(() => {
  for (const target of writables) {
    assert.deepStrictEqual(target.output, [input]);
    target.on('unpipe', common.mustCall());
    readable.unpipe(target);
  }

  readable.push('something else'); // This does not get through.

  readable.push(null);
  readable.resume(); // Make sure the 'end' event gets emitted.
}));
readable.on('end', common.mustCall(() => {
  for (const target of writables) {
    assert.deepStrictEqual(target.output, [input]);
  }
}));
export default module.exports;