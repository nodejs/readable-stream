/*<replacement>*/
      require('babel-polyfill');
      var util = require('util');
      for (var i in util) exports[i] = util[i];
      /*</replacement>*/// Flags: --experimental-modules
/* eslint-disable node-core/required-modules */
import common from './index.js';

const {
  isMainThread,
  isWindows,
  isAIX,
  isLinuxPPCBE,
  isSunOS,
  isFreeBSD,
  isOpenBSD,
  isLinux,
  isOSX,
  enoughTestMem,
  enoughTestCpu,
  rootDir,
  buildType,
  localIPv6Hosts,
  opensslCli,
  PIPE,
  hasIPv6,
  childShouldThrowAndAbort,
  createZeroFilledFile,
  platformTimeout,
  allowGlobals,
  mustCall,
  mustCallAtLeast,
  hasMultiLocalhost,
  skipIfEslintMissing,
  canCreateSymLink,
  getCallSite,
  mustNotCall,
  printSkipMessage,
  skip,
  ArrayStream,
  nodeProcessAborted,
  busyLoop,
  isAlive,
  noWarnCode,
  expectWarning,
  expectsError,
  skipIfInspectorDisabled,
  skipIf32Bits,
  getArrayBufferViews,
  getBufferSources,
  disableCrashOnUnhandledRejection,
  getTTYfd,
  runWithInvalidFD
} = common;

export {
  isMainThread,
  isWindows,
  isAIX,
  isLinuxPPCBE,
  isSunOS,
  isFreeBSD,
  isOpenBSD,
  isLinux,
  isOSX,
  enoughTestMem,
  enoughTestCpu,
  rootDir,
  buildType,
  localIPv6Hosts,
  opensslCli,
  PIPE,
  hasIPv6,
  childShouldThrowAndAbort,
  createZeroFilledFile,
  platformTimeout,
  allowGlobals,
  mustCall,
  mustCallAtLeast,
  hasMultiLocalhost,
  skipIfEslintMissing,
  canCreateSymLink,
  getCallSite,
  mustNotCall,
  printSkipMessage,
  skip,
  ArrayStream,
  nodeProcessAborted,
  busyLoop,
  isAlive,
  noWarnCode,
  expectWarning,
  expectsError,
  skipIfInspectorDisabled,
  skipIf32Bits,
  getArrayBufferViews,
  getBufferSources,
  disableCrashOnUnhandledRejection,
  getTTYfd,
  runWithInvalidFD
};

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
