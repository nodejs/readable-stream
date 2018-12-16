"use strict";

/*<replacement>*/
require('@babel/polyfill');

var util = require('util');

for (var i in util) {
  exports[i] = util[i];
}
/*</replacement>*/

/* eslint-disable node-core/required-modules */


'use strict';
/*<replacement>*/


var objectKeys = objectKeys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var fs = require('fs');

var path = require('path');

function rimrafSync(p) {
  var st;

  try {
    st = fs.lstatSync(p);
  } catch (e) {
    if (e.code === 'ENOENT') return;
  }

  try {
    if (st && st.isDirectory()) rmdirSync(p, null);else fs.unlinkSync(p);
  } catch (e) {
    if (e.code === 'ENOENT') return;
    if (e.code === 'EPERM') return rmdirSync(p, e);
    if (e.code !== 'EISDIR') throw e;
    rmdirSync(p, e);
  }
}

function rmdirSync(p, originalEr) {
  try {
    fs.rmdirSync(p);
  } catch (e) {
    if (e.code === 'ENOTDIR') throw originalEr;

    if (e.code === 'ENOTEMPTY' || e.code === 'EEXIST' || e.code === 'EPERM') {
      var enc = process.platform === 'linux' ? 'buffer' : 'utf8';
      forEach(fs.readdirSync(p, enc), function (f) {
        if (f instanceof Buffer) {
          var buf = Buffer.concat([Buffer.from(p), Buffer.from(path.sep), f]);
          rimrafSync(buf);
        } else {
          rimrafSync(path.join(p, f));
        }
      });
      fs.rmdirSync(p);
    }
  }
}

var testRoot = process.env.NODE_TEST_DIR ? fs.realpathSync(process.env.NODE_TEST_DIR) : path.resolve(__dirname, '..'); // Using a `.` prefixed name, which is the convention for "hidden" on POSIX,
// gets tools to ignore it by default or by simple rules, especially eslint.

var tmpdirName = '.tmp';

if (process.env.TEST_THREAD_ID) {
  tmpdirName += ".".concat(process.env.TEST_THREAD_ID);
}

var tmpPath = path.join(testRoot, tmpdirName);

function refresh() {
  rimrafSync(this.path);
  fs.mkdirSync(this.path);
}

module.exports = {
  path: tmpPath,
  refresh: refresh
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}