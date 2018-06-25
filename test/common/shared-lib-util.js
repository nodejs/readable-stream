'use strict';

/*<replacement>*/
require('babel-polyfill');
var util = require('util');
for (var i in util) {
  exports[i] = util[i];
} /*</replacement>*/'use strict';

/*<replacement>*/
var objectKeys = objectKeys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

var common = require('../common');
var path = require('path');

// If node executable is linked to shared lib, need to take care about the
// shared lib path.
exports.addLibraryPath = function (env) {
  if (!process.config.variables.node_shared) {
    return;
  }

  env = env || process.env;

  env.LD_LIBRARY_PATH = (env.LD_LIBRARY_PATH ? env.LD_LIBRARY_PATH + path.delimiter : '') + path.join(path.dirname(process.execPath), 'lib.target');
  // For AIX.
  env.LIBPATH = (env.LIBPATH ? env.LIBPATH + path.delimiter : '') + path.join(path.dirname(process.execPath), 'lib.target');
  // For Mac OSX.
  env.DYLD_LIBRARY_PATH = (env.DYLD_LIBRARY_PATH ? env.DYLD_LIBRARY_PATH + path.delimiter : '') + path.dirname(process.execPath);
  // For Windows.
  env.PATH = (env.PATH ? env.PATH + path.delimiter : '') + path.dirname(process.execPath);
};

// Get the full path of shared lib.
exports.getSharedLibPath = function () {
  if (common.isWindows) {
    return path.join(path.dirname(process.execPath), 'node.dll');
  } else if (common.isOSX) {
    return path.join(path.dirname(process.execPath), 'libnode.' + process.config.variables.shlib_suffix);
  } else {
    return path.join(path.dirname(process.execPath), 'lib.target', 'libnode.' + process.config.variables.shlib_suffix);
  }
};

// Get the binary path of stack frames.
exports.getBinaryPath = function () {
  return process.config.variables.node_shared ? exports.getSharedLibPath() : process.execPath;
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}