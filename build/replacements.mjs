const streamsInternalsRequireRelativeUtil = ["require\\('util'\\)", "require('../../util')"]

const streamsInternalsRequireRelativeInternalUtil = ["require\\('internal/util'\\)", "require('../../util')"]

const streamsInternalsRequireInternal = ["require\\('internal/([^']+)'\\)", "require('../$1')"]

const inspectCustom = ['inspect.custom', '"custom"']

const internalRequireRelativeUtil = ["require\\('util'\\)", "require('../util')"]

const errorsGetSystemErrorName = [
  "require\\('internal/util'\\)",
  `
{
  getSystemErrorName(err) {
    const entry = errmap.get(err);
    return entry ? entry[0] : \`Unknown system error \${err}\`;
  }
}
  `
]

const errorsRequireInternal = ["require\\('internal/([^']+)'\\)", "require('../$1')"]

const errorsRequireInternalUtil = ["const (.+) = require\\('\\.\\./util'\\);", "const $1 = require('../../util');"]

const errorsBinding = ["process.binding\\('uv'\\)", "require('./uv-browser')"]

const errorsBufferMaxLength = [
  "const \\{ kMaxLength \\} = process\\.binding\\('buffer'\\);",
  'const kMaxLength = 4294967296;'
]

const wrapBinding = [/internalBinding/, 'process.binding']

const streamsRequireRelative = ["require\\('(_stream.+)'\\);", "require('./$1');"]

const streamsRequireDeprecate = ["require\\('internal/util'\\);", "{ deprecate: require('util-deprecate') };"]

const streamsRequireRelativeInternal = ["require\\('(internal/[^']+)'\\)", "require('./$1')"]

const streamsRequireLegacy = [
  "const Stream = require\\('stream'\\);",
  "const Stream = require('./internal/streams/legacy');"
]

const streamsRequireRelativeUtil = ["const util = require\\('util'\\);", "const util = require('./util');"]

const streamsRequireRelativeDuplex = ['instanceof Stream.Duplex', "instanceof require('./_stream_duplex')"]

const streamsWritableIsBuffer = ['Object\\.getPrototypeOf\\((chunk)\\) !== Buffer\\.prototype', '!Buffer.isBuffer($1)']

const streamsWritableWriteRequest = [
  'state\\.lastBufferedRequest = \\{[^}]+\\}',
  'state.lastBufferedRequest = new WriteReq(chunk, encoding, cb)'
]

const streamsWritableCorkedRequest = [
  'var corkReq = [\\s\\S]+?(\\S+?)\\.corkedRequestsFree = corkReq',
  '$1.corkedRequestsFree = new CorkedRequest($1)'
]

const testCommonAsyncHooksDisableStart = ["(require\\('async_hooks'\\))", '/* $1']

const testCommonAsyncHooksDisableEnd = ['(\\}\\).enable\\(\\);)', '$1 */']

const testCommonTimer = ["process\\.binding\\('timer_wrap'\\)\\.Timer;", '{ now: function (){} };']

const testCommonLeakedGlobals = [
  '(function leakedGlobals\\(\\) \\{)',
  `
/* replacement start */
if (typeof constructor == 'function') {
  knownGlobals.push(constructor);
}

if (typeof DTRACE_NET_SOCKET_READ == 'function') {
  knownGlobals.push(DTRACE_NET_SOCKET_READ);
}

if (typeof DTRACE_NET_SOCKET_WRITE == 'function') {
  knownGlobals.push(DTRACE_NET_SOCKET_WRITE);
}

if (global.__coverage__ == 'function') {
  knownGlobals.push(global.__coverage__);
}

for (const item of ['queueMicrotask', 'performance']) {
  if (typeof global[item] !== undefined) {
    knownGlobals.push(global[item]);
  }
}        
/* replacement end */

$1
`
]

// Following replacements on this file are for browser tests
// const testCommonHasCrypto = ['const hasCrypto = Boolean\\(process.versions.openssl\\);', 'const hasCrypto = true;']

// const testCommonWorkerThreads = ["require\\('module'\\)\\.builtinModules\\.includes\\('worker_threads'\\)", 'false']

// const testCommonArgv = ['process.argv.length === 2', 'false']

// const testCommonCpus = ['os.cpus()', 'os.cpus().length === 0 ? [{ speed: 1000 }] : os.cpus()']

// const testCommonBuildType = [
//   'const buildType = process.config.target_defaults.default_configuration;',
//   "const buildType = 'readable-stream';"
// ]

const testParallelIncludeTap = [
  "('use strict')",

  `$1

const tap = require('tap');
const silentConsole = { log() {}, error() {} };
`
]

const testParallelRequireStream = ["require\\('stream'\\)", "require('../../lib')"]

const testParallelRequireStreamInternals = ["require\\('(_stream_\\w+)'\\)", "require('../../lib/$1')"]

const testParallelRequireStreamClasses = [
  'Stream.(Readable|Writable|Duplex|Transform|PassThrough)',
  "require('../../lib').$1"
]

const testParallelPromisify = [
  "const \\{ promisify \\} = require\\('util'\\);",
  "const promisify = require('util-promisify');"
]

const testParallelSilentConsole = ['console.(log|error)', 'silentConsole.$1']

export const replacements = {
  'lib/internal/streams/.+': [
    streamsInternalsRequireRelativeUtil,
    streamsInternalsRequireRelativeInternalUtil,
    streamsInternalsRequireInternal,
    inspectCustom
  ],
  'lib/internal/[^/]+': [internalRequireRelativeUtil],
  'lib/internal/errors-browser.js': [
    errorsGetSystemErrorName,
    errorsRequireInternal,
    errorsRequireInternalUtil,
    errorsBinding,
    errorsBufferMaxLength
  ],
  'lib/internal/wrap_js_stream.js': [wrapBinding],
  'lib/_stream_.+': [
    streamsRequireRelative,
    streamsRequireDeprecate,
    streamsRequireRelativeInternal,
    streamsRequireLegacy,
    streamsRequireRelativeUtil
  ],
  'lib/_stream_(readable|writable).js': [streamsRequireRelativeDuplex],
  'lib/_stream_writable.js': [streamsWritableIsBuffer, streamsWritableWriteRequest, streamsWritableCorkedRequest],
  'test/common/index.js': [
    testCommonAsyncHooksDisableStart,
    testCommonAsyncHooksDisableEnd,
    testCommonTimer,
    testCommonLeakedGlobals
  ],
  'test/parallel/.+': [
    testParallelIncludeTap,
    testParallelRequireStream,
    testParallelRequireStreamInternals,
    testParallelRequireStreamClasses,
    testParallelPromisify,
    testParallelSilentConsole
  ]
}
