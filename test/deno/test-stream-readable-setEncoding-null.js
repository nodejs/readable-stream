'use strict';

import { Readable } from "../../readable-deno.js";
import _assert from "assert";
import _commonDenoJs from "../common-deno.js";
var module = {
  exports: {}
};
var exports = module.exports;
_commonDenoJs;
const assert = _assert;
{
  const readable = new Readable({
    encoding: 'hex'
  });
  assert.strictEqual(readable._readableState.encoding, 'hex');
  readable.setEncoding(null);
  assert.strictEqual(readable._readableState.encoding, 'utf8');
}
export default module.exports;