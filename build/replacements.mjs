const legacyStreamsRequireStream = ["require\\('stream'\\)", "require('./stream')"]

const internalStreamsBufferPolyfill = [
  "'use strict'",
  `
  'use strict'

  const bufferModule = require('buffer');
  `
]

const internalStreamsAbortControllerPolyfill = [
  "'use strict'",
  `
  'use strict'

  `
]

const internalStreamsNoRequireBlob = [
  "const \\{\\n  isBlob,\\n\\} = require\\('internal/blob'\\);",
  `
    const Blob = globalThis.Blob || bufferModule.Blob;
    const isBlob = typeof Blob !== 'undefined' ? function isBlob (b) { return b instanceof Blob } : function isBlob(b) { return false; }
  `
]

const internalStreamsInspectCustom = ['inspect.custom', "Symbol.for('nodejs.util.inspect.custom')"]

const internalStreamsNoRequireAbortController = [
  'const \\{ AbortController \\} = .+',
  'const AbortController = globalThis.AbortController || require(\'abort-controller\').AbortController;'
]

const internalStreamsRequireInternal = ["require\\('internal/([^']+)'\\)", "require('../$1')"]

const internalStreamsRequireErrors = ["require\\('internal/errors'\\)", "require('../../ours/errors')"]

const internalStreamsRequireEventEmitter = ['const EE =', 'const { EventEmitter: EE } =']

const internalStreamsRequirePrimordials = ['= primordials', "= require('../../ours/primordials')"]

const internalStreamsRequireRelativeUtil = [
  'const \\{ (once|createDeferredPromise|) \\} = .+;',
  "const { $1 } = require('../../ours/util');"
]

const internalStreamsRequireRelativeDuplex = ['instanceof Stream.Duplex', "instanceof require('./duplex')"]

const internalStreamsRequireStream = ["require\\('stream'\\)", "require('../../stream')"]

const internalStreamsRequireStreams = ["require\\('internal/streams/([^']+)'\\)", "require('./$1')"]

const internalStreamsRequireUtil = [
  "require\\('internal/util(?:/(?:debuglog|inspect))?'\\)",
  "require('../../ours/util')"
]

const internalStreamsRequireUtilDebuglog = ["require\\('internal/util/debuglog'\\)", "require('../../ours/util')"]

const internalStreamsRequireWebStream = ["require\\('internal/webstreams/adapters'\\)", '{}']

const internalStreamsWeakHandler = [
  "const \\{ kWeakHandler \\} = require\\('../event_target'\\);",
  "const kWeakHandler = require('../../ours/primordials').Symbol('kWeak');"
]

const internalValidatorsNoCoalesceAssignment = [
  '\\s*(.+) \\?\\?= (.+)',
  `
    if (typeof $1 === 'undefined') {
      $1 = $2
    }
  `
]

const internalValidatorsNoRequireSignals = [
  "const \\{ signals \\} = internalBinding\\('constants'\\).os;",
  'const signals = {};'
]

const internalValidatorsRequireAssert = ["require\\('internal/assert'\\)", "require('assert')"]

const internalValidatorsRequireAsyncHooks = ["require\\('./async_hooks'\\)", "require('internal/async_hooks')"]

const internalValidatorsRequireErrors = ["require\\('internal/errors'\\)", "require('../ours/errors')"]

const internalValidatorsRequirePrimordials = ['= primordials', "= require('../ours/primordials')"]

const internalValidatorsRequireRelativeUtil = ["require\\('internal/util'\\)", "require('../ours/util')"]

const internalValidatorsRequireUtilTypes = ["require\\('internal/util/types'\\)", "require('../ours/util').types"]

const streamIndexIsUint8Array = [
  "Stream._isUint8Array = require\\('internal/util/types'\\).isUint8Array;",
  `
    Stream._isUint8Array = function isUint8Array(value) { 
      return value instanceof Uint8Array 
    };
  `
]

const streamIndexRequireInternal = ["require\\('internal/([^']+)'\\)", "require('./internal/$1')"]

const streamIndexRequireInternalBuffer = ["require\\('internal/buffer'\\)", '{}']

const streamIndexRequireErrors = ["require\\('internal/errors'\\);", "require('./ours/errors');"]

const streamIndexRequirePrimordials = ['= primordials', "= require('./ours/primordials')"]

const streamIndexRequirePromises = ["require\\('stream/promises'\\);", "require('./stream/promises');"]

const streamIndexRequireUtil = ["require\\('internal/util'\\)", "require('./ours/util')"]

const streamIndexUint8ArrayToBuffer = ['new internalBuffer.FastBuffer', 'Buffer.from']

const streamsRequireErrors = ["require\\('internal/errors'\\)", "require('../ours/errors')"]

const streamsRequireInternal = ["require\\('internal/(.+)'\\)", "require('../internal/$1')"]

const streamsRequirePrimordials = ['= primordials', "= require('../ours/primordials')"]

const testCommonKnownGlobals = [
  'let knownGlobals = \\[(\\n\\s+)',
  `
    let knownGlobals = [\n
      typeof AggregateError !== 'undefined' ? AggregateError : require('../../lib/ours/util').AggregateError,
      typeof AbortController !== 'undefined' ? AbortController : require('abort-controller').AbortController,
      typeof AbortSignal !== 'undefined' ? AbortSignal : require('abort-controller').AbortSignal,
      typeof EventTarget !== 'undefined' ? EventTarget : require('event-target-shim').EventTarget,
  `
]

const testParallelBindings = [
  "const \\{ internalBinding \\} = require\\('../../lib/internal/test/binding'\\);",
  'const internalBinding = process.binding'
]

const testParallelHasOwn = ['Object.hasOwn\\(', 'Reflect.has(']

const testParallelIncludeTap = [
  "('use strict')",
  `
    $1

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  `
]

const testParallelImportStreamInMjs = [" from 'stream';", "from '../../lib/ours/index.js';"]

const testParallelImportTapInMjs = ["(from 'assert';)", "$1\nimport tap from 'tap';"]

const testParallelDuplexFromBlob = [
  "const \\{ Blob \\} = require\\('buffer'\\);",
  "const Blob = globalThis.Blob || require('buffer').Blob"
]

const testParallelDuplexSkipWithoutBlob = [
  "(\\{\n  const blob = new Blob\\(\\['blob'\\]\\))",
  "if (typeof Blob !== 'undefined') $1"
]

const testParallelFinishedEvent = ["res.on\\('close", "res.on('finish"]

const testParallelFlatMapWinLineSeparator = [
  "'xyz\\\\n'\\.repeat\\(5\\)",
  "(process.platform === 'win32' ? 'xyz\\r\\n' : 'xyz\\n').repeat(5)"
]

const testParallelPreprocessWinLineSeparator = [
  'assert.strictEqual\\(streamedData, modelData\\);',
  "assert.strictEqual(streamedData, process.platform === 'win32' ? modelData.replace(/\\r\\n/g, '\\n') : modelData);"
]

const testParallelReadableBufferListInspect = [
  'assert.strictEqual\\(\\n\\s+util.inspect\\(\\[ list \\], \\{ compact: false \\}\\),\\n\\s+`\\[\\n\\s+BufferList \\{\\n\\s+head: \\[Object\\],\\n\\s+tail: \\[Object\\],\\n\\s+length: 4\\n\\s+\\}\\n\\]`\\);',
  `
    assert.strictEqual(typeof list.head, 'object');
    assert.strictEqual(typeof list.tail, 'object');
    assert.strictEqual(list.length, 4);
  `
]

const testParallelRequireStream = ["require\\('stream'\\)", "require('../../lib/ours/index')"]

const testParallelRequireStreamConsumer = ["require\\('stream/consumer'\\)", "require('../../lib/stream/consumer')"]

const testParallelRequireStreamInternals = ["require\\('(internal/.+)'\\)", "require('../../lib/$1')"]

const testParallelRequireStreamInternalsLegacy = ["require\\('(_stream_\\w+)'\\)", "require('../../lib/$1')"]

const testParallelRequireStreamPromises = ["require\\('stream/promises'\\)", "require('../../lib/stream/promises')"]

const testParallelRequireStreamWeb = ["require\\('stream/web'\\)", "require('../../lib/stream/web')"]

const testParallelSilentConsole = ['console.(log|error)', 'silentConsole.$1']

const testParallelTimersPromises = [
  "const { setTimeout } = require\\('timers/promises'\\);",
  `
    const st = require('timers').setTimeout;

    function setTimeout(ms) {
      return new Promise(resolve => {
        st(resolve, ms);
      });
    }
  `
]

const testParallelTicksReenableConsoleLog = ['silentConsole.log\\(i\\);', 'console.log(i);']

const testParallelTickSaveHook = ['async_hooks.createHook\\(\\{', 'const hook = async_hooks.createHook({']

const readmeInfo = ['(This package is a mirror of the streams implementations in Node.js) (\\d+.\\d+.\\d+).', '$1 $2.']

const readmeLink = ['(\\[Node.js website\\]\\(https://nodejs.org/dist/v)(\\d+.\\d+.\\d+)', '$1$2']

export const replacements = {
  'lib/_stream.+': [legacyStreamsRequireStream],
  'lib/internal/streams/duplexify.+': [
    internalStreamsBufferPolyfill,
    internalStreamsAbortControllerPolyfill,
    internalStreamsNoRequireBlob,
    internalStreamsNoRequireAbortController
  ],
  'lib/internal/streams/(operators|pipeline).+': [
    internalStreamsAbortControllerPolyfill,
    internalStreamsNoRequireAbortController
  ],
  'lib/internal/streams/.+': [
    internalStreamsRequireErrors,
    internalStreamsRequireEventEmitter,
    internalStreamsRequirePrimordials,
    internalStreamsRequireRelativeDuplex,
    internalStreamsRequireRelativeUtil,
    internalStreamsRequireStream,
    internalStreamsRequireStreams,
    internalStreamsRequireUtil,
    internalStreamsRequireUtilDebuglog,
    internalStreamsRequireWebStream,
    internalStreamsRequireInternal,
    internalStreamsWeakHandler,
    internalStreamsInspectCustom
  ],
  'lib/internal/validators.js': [
    internalValidatorsRequireAssert,
    internalValidatorsRequireAsyncHooks,
    internalValidatorsRequireErrors,
    internalValidatorsRequirePrimordials,
    internalValidatorsRequireRelativeUtil,
    internalValidatorsRequireUtilTypes,
    internalValidatorsNoRequireSignals,
    internalValidatorsNoCoalesceAssignment
  ],
  'lib/stream.js': [
    streamIndexIsUint8Array,
    streamIndexUint8ArrayToBuffer,
    streamIndexRequireInternalBuffer,
    streamIndexRequireErrors,
    streamIndexRequirePrimordials,
    streamIndexRequirePromises,
    streamIndexRequireUtil,
    streamIndexRequireInternal
  ],
  'lib/stream/.+': [streamsRequireErrors, streamsRequirePrimordials, streamsRequireInternal],
  'test/common/index.js': [testCommonKnownGlobals],
  'test/parallel/.+': [
    testParallelIncludeTap,
    testParallelRequireStream,
    testParallelRequireStreamConsumer,
    testParallelRequireStreamInternals,
    testParallelRequireStreamInternalsLegacy,
    testParallelRequireStreamPromises,
    testParallelRequireStreamWeb,
    testParallelImportStreamInMjs,
    testParallelImportTapInMjs,
    testParallelBindings,
    testParallelHasOwn,
    testParallelSilentConsole,
    testParallelTimersPromises
  ],
  'test/parallel/test-stream-duplex-from.js': [testParallelDuplexFromBlob, testParallelDuplexSkipWithoutBlob],
  'test/parallel/test-stream-finished.js': [testParallelFinishedEvent],
  'test/parallel/test-stream-flatMap.js': [testParallelFlatMapWinLineSeparator],
  'test/parallel/test-stream-preprocess.js': [testParallelPreprocessWinLineSeparator],
  'test/parallel/test-stream-writable-samecb-singletick.js': [
    testParallelTicksReenableConsoleLog,
    testParallelTickSaveHook
  ],
  'test/parallel/test-stream2-readable-from-list.js': [testParallelReadableBufferListInspect],
  'README.md': [readmeInfo, readmeLink]
}
