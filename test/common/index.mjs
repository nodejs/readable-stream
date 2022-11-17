import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const common = require('./index.js')

const {
  isMainThread,
  isWindows,
  isAIX,
  isIBMi,
  isLinuxPPCBE,
  isSunOS,
  isDumbTerminal,
  isFreeBSD,
  isOpenBSD,
  isLinux,
  isOSX,
  enoughTestMem,
  buildType,
  localIPv6Hosts,
  opensslCli,
  PIPE,
  hasCrypto,
  hasIPv6,
  childShouldThrowAndAbort,
  checkoutEOL,
  createZeroFilledFile,
  platformTimeout,
  allowGlobals,
  mustCall,
  mustCallAtLeast,
  mustSucceed,
  hasMultiLocalhost,
  skipIfDumbTerminal,
  skipIfEslintMissing,
  canCreateSymLink,
  getCallSite,
  mustNotCall,
  mustNotMutateObjectDeep,
  printSkipMessage,
  skip,
  nodeProcessAborted,
  isAlive,
  expectWarning,
  expectsError,
  skipIfInspectorDisabled,
  skipIf32Bits,
  getArrayBufferViews,
  getBufferSources,
  getTTYfd,
  runWithInvalidFD,
  spawnPromisified
} = common

export {
  isMainThread,
  isWindows,
  isAIX,
  isIBMi,
  isLinuxPPCBE,
  isSunOS,
  isDumbTerminal,
  isFreeBSD,
  isOpenBSD,
  isLinux,
  isOSX,
  enoughTestMem,
  buildType,
  localIPv6Hosts,
  opensslCli,
  PIPE,
  hasCrypto,
  hasIPv6,
  childShouldThrowAndAbort,
  checkoutEOL,
  createZeroFilledFile,
  platformTimeout,
  allowGlobals,
  mustCall,
  mustCallAtLeast,
  mustSucceed,
  hasMultiLocalhost,
  skipIfDumbTerminal,
  skipIfEslintMissing,
  canCreateSymLink,
  getCallSite,
  mustNotCall,
  mustNotMutateObjectDeep,
  printSkipMessage,
  skip,
  nodeProcessAborted,
  isAlive,
  expectWarning,
  expectsError,
  skipIfInspectorDisabled,
  skipIf32Bits,
  getArrayBufferViews,
  getBufferSources,
  getTTYfd,
  runWithInvalidFD,
  createRequire,
  spawnPromisified
}
