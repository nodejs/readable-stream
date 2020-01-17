const altForEachImplReplacement = require('./common-replacements').altForEachImplReplacement
    , altForEachUseReplacement  = require('./common-replacements').altForEachUseReplacement
    , altIndexOfImplReplacement = require('./common-replacements').altIndexOfImplReplacement
    , altIndexOfUseReplacement  = require('./common-replacements').altIndexOfUseReplacement
    , objectKeysDefine =
    require('./common-replacements').objectKeysDefine
    , objectKeysReplacement =
    require('./common-replacements').objectKeysReplacement
    , bufferShimFix =
    require('./common-replacements').bufferShimFix
    , bufferStaticMethods =
    require('./common-replacements').bufferStaticMethods
    , specialForEachReplacment =
    require('./common-replacements').specialForEachReplacment
    , deepStrictEqual = [
        /util\.isDeepStrictEqual/,
        'require(\'deep-strict-equal\')'
      ]
    , tapOk = [
        /console\.log\('ok'\);/g,
        'require(\'tap\').pass();'
      ]
    , catchES7 = [
        /} catch {/,
        '} catch(_e) {'
      ]
    , catchES7OpenClose = [
        /} catch {}/,
        '} catch(_e) {}'
      ]


module.exports.all = [
    [
        /require\(['"]stream['"]\)/g
      , 'require(\'../../\')'
    ]

    // some tests need stream.Stream but readable.js doesn't offer that
    // and we've undone it with the previous replacement

  , [
        /stream\.Stream|require\('\.\.\/\.\.\/'\)\.Stream/g
      , 'require(\'stream\').Stream'
    ]

  , [
        /require\(['"](_stream_\w+)['"]\)/g
      , 'require(\'../../lib/$1\')'
    ]

  , [
        /Stream.(Readable|Writable|Duplex|Transform|PassThrough)/g
      , 'require(\'../../\').$1'
    ]
  , bufferShimFix
  , bufferStaticMethods
  , [
        /require\(['"]assert['"]\)/g
      , 'require(\'assert/\')'
    ]
  , [
        /\/\/ Flags: .*/
      , ''
    ]
]

module.exports['test-stream2-basic.js'] = [
    altForEachImplReplacement
  , specialForEachReplacment
]

module.exports['test-stream2-objects.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-transform.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
]

module.exports['test-stream2-writable.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
    /'latin1',/g,
    '\'binary\','
  ]
]

module.exports['test-stream-big-packet.js'] = [
    altIndexOfImplReplacement
  , altIndexOfUseReplacement
]

module.exports['test-stream-end-paused.js'] = [
    [
      /console.log\('ok'\);/,
      ''
    ]
]

module.exports['common.js'] = [
    objectKeysDefine
  , objectKeysReplacement
  , altForEachImplReplacement
  , altForEachUseReplacement
  , deepStrictEqual
  , catchES7
  , catchES7OpenClose
  , [
        /require\('module'\)\.builtinModules\.includes\('worker_threads'\)/,
        'false'
    ]
  , [
        /process.argv.length === 2/,
        'false'
    ]
  , [
        /^(  for \(var x in global\) \{|function leakedGlobals\(\) \{)$/m
      ,   '  /*<replacement>*/\n'
        + '  if (typeof constructor == \'function\')\n'
        + '    knownGlobals.push(constructor);\n'
        + '  if (typeof DTRACE_NET_SOCKET_READ == \'function\')\n'
        + '    knownGlobals.push(DTRACE_NET_SOCKET_READ);\n'
        + '  if (typeof DTRACE_NET_SOCKET_WRITE == \'function\')\n'
        + '    knownGlobals.push(DTRACE_NET_SOCKET_WRITE);\n'
        + '  if (global.__coverage__)\n'
        + '    knownGlobals.push(__coverage__);\n'
        + '\'console,clearImmediate,setImmediate,core,__core-js_shared__,Promise,Map,Set,WeakMap,WeakSet,Reflect,System,queueMicrotask,asap,Observable,regeneratorRuntime,_babelPolyfill\'.split(\',\').filter(function (item) {  return typeof global[item] !== undefined}).forEach(function (item) {knownGlobals.push(global[item])})'
        + '  /*</replacement>*/\n\n$1'
    ]

  , [
        /(exports.mustCall[\s\S]*)/m
      ,   '$1\n'
        + 'if (!util._errnoException) {\n'
        + '  var uv;\n'
        + '  util._errnoException = function(err, syscall) {\n'
        + '    if (util.isUndefined(uv)) try { uv = process.binding(\'uv\'); } catch (e) {}\n'
        + '    var errname = uv ? uv.errname(err) : \'\';\n'
        + '    var e = new Error(syscall + \' \' + errname);\n'
        + '    e.code = errname;\n'
        + '    e.errno = errname;\n'
        + '    e.syscall = syscall;\n'
        + '    return e;\n'
        + '  };\n'
        + '}\n'
    ]

  , [
        /^if \(global\.ArrayBuffer\) \{([^\}]+)\}$/m
      ,   '/*<replacement>*/if (!process.browser) {'
        + '\nif \(global\.ArrayBuffer\) {$1}\n'
        + '}/*</replacement>*/\n'
    ]
    , [
          /^Object\.defineProperty\(([\w\W]+?)\}\)\;/mg
        ,   '/*<replacement>*/if (!process.browser) {'
          + '\nObject\.defineProperty($1});\n'
          + '}/*</replacement>*/\n'
      ]
    , [
      /if \(!process\.send\)/
      , 'if (!process.send && !process.browser)'
    ]
    , [
      /^/,
      `/*<replacement>*/
      require('@babel/polyfill');
      var util = require('util');
      for (var i in util) exports[i] = util[i];
      /*</replacement>*/`
    ],
    [
      /var regexp = `\^\(\\\\w\+\)\\\\s\+\\\\s\$\{port\}\/\$\{protocol\}\\\\s`;/,
      `var regexp = '^(\\w+)\\s+\\s' + port + '/' + protocol + '\\s';`
    ],
    [
        /require\(['"]stream['"]\)/g
      , 'require(\'../../\')'
    ],
    [
    /^var util = require\('util'\);/m
  ,   '\n/*<replacement>*/\nvar util = require(\'core-util-is\');\n'
    + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
  ],
  [
  /^const util = require\('util'\);/m
,   '\n/*<replacement>*/\nvar util = require(\'core-util-is\');\n'
  + 'util.inherits = require(\'inherits\');\n/*</replacement>*/\n'
]
, [
  /process\.binding\('timer_wrap'\)\.Timer;/,
  '{now: function (){}}'
],
[
  /(exports\.enoughTestCpu[^;]+;)/,
  '/*$1*/'
],
[
  /exports\.buildType/,
  '//exports.buildType'
],
[
  /require\('async_hooks'\)/,
  '/*require(\'async_hooks\')'
],
[
  /\}\).enable\(\);/,
  '}).enable();*/'
],
[
  /const async_hooks = require\('async_hooks'\)/,
  'var async_hooks = require(\'async_\' + \'hooks\')'
],
[
  /(?:var|const) async_wrap = process\.binding\('async_wrap'\);\n.*(?:var|const) (?:{ )?kCheck(?: })? = async_wrap\.constants(?:\.kCheck)?;/gm,
  '// const async_wrap = process.binding(\'async_wrap\');\n' +
  '  // const kCheck = async_wrap.constants.kCheck;'
],
[
  /async_wrap\.async_hook_fields\[kCheck\] \+= 1;/,
  '// async_wrap.async_hook_fields[kCheck] += 1;'
],
[
  /os\.cpus\(\)/,
  'os.cpus().length === 0 ? [{ speed: 1000 }] : os.cpus()'
],
[
  /const buildType = process.config.target_defaults.default_configuration;/,
  'const buildType = \'readable-stream\';'
],
[
  /const hasCrypto = Boolean\(process.versions.openssl\);/,
  'const hasCrypto = true;'
]
]

// this test has some trouble with the nextTick depth when run
// to stdout, it's also very noisy so we'll quiet it
module.exports['test-stream-pipe-multi.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
        /console\.error/g
      , '//console.error'
    ]

  , [
        /process\.nextTick/g
      , 'setImmediate'
    ]
]

// just noisy
module.exports['test-stream2-large-read-stall.js'] = [
    [
        /console\.error/g
      , ';false && console.error'
    ]
]

module.exports['test-stream-pipe-cleanup.js'] = [
    [
        /(function Writable\(\) \{)/
      , '(function (){\nif (/^v0\\.8\\./.test(process.version))\n  return\n\n$1'
    ]
    ,
    [
      /$/
      ,'}())'
    ]
]

module.exports['test-stream2-stderr-sync.js'] = [
    altForEachImplReplacement
  , altForEachUseReplacement
  , [
        // 'tty_wrap' is too different across node versions.
        // this bypasses it and replicates a console.error() test
        /(function child0\(\) \{)/
      ,   '$1\n'
        + '  return console.error(\'child 0\\nfoo\\nbar\\nbaz\');\n'
    ]
]

module.exports['test-stream-unshift-read-race.js'] = [
  [
    /data\.slice\(pos, pos \+ n\)/g,
    'data.slice(pos, Math.min(pos + n, data.length))'
  ]
]

module.exports['test-stream-pipe-without-listenerCount.js'] = [
  [
    /require\(\'stream\'\)/g,
    'stream'
  ]
]

module.exports['test-stream2-unpipe-drain.js'] = [
  [
    /^/,
    `(function () {\n`
  ],
  [
    /$/
    ,'}())'
  ]
]

module.exports['test-stream2-decode-partial.js'] = [
 [
   /readable\.push\(source\.slice\(4, 6\)\)/
  ,`readable.push(source.slice(4, source.length));`
 ]
]


module.exports['test-stream3-cork-uncork.js'] = module.exports['test-stream3-cork-end.js'] = [
  [
    /assert\.ok\(seen\.equals\(expected\)\);/,
    'assert.deepEqual(seen, expected);'
  ]
]
module.exports['test-stream2-readable-from-list.js'] = [
  [
    /require\('internal\/streams\/buffer_list'\)/,
    'require(\'../../lib/internal/streams/buffer_list\')'
  ],
  [
    /assert\.strictEqual\(\n *util.inspect\(\[ list \], \{ compact: false \}\),\n *`\[\n *BufferList \{\n *head: \[Object\],\n *tail: \[Object\],\n *length: 4\n *\}\n *\]`\);/m,
    'assert.strictEqual(util.inspect([ list ], { compact: false }).indexOf(\'BufferList\') > 0, true)'
  ]
]
module.exports['test-stream-writev.js'] = [
  tapOk,
  [
    /console.log\(`# decode=/,
    'require(\'tap\').test(`# decode='
  ]
]

module.exports['test-stream3-pause-then-read.js'] = [
  tapOk
]

module.exports['test-stream-unshift-read-race.js'] = [
  tapOk
]

module.exports['test-stream2-unpipe-leak.js'] = [
  tapOk
]

module.exports['test-stream2-compatibility.js'] = [
  tapOk
]

module.exports['test-stream-push-strings.js'] = [
  tapOk
]

module.exports['test-stream-unshift-empty-chunk.js'] = [
  tapOk
]

module.exports['test-stream2-pipe-error-once-listener.js'] = [
  tapOk
]

module.exports['test-stream-push-order.js'] = [
  tapOk
]

module.exports['test-stream2-push.js'] = [
  tapOk
]

module.exports['test-stream2-readable-empty-buffer-no-eof.js'] = [
  tapOk,
  [
    /case 3:\n(\s+)setImmediate\(r\.read\.bind\(r, 0\)\);/,
    'case 3:\n$1setTimeout(r.read.bind(r, 0), 50);'
  ]
]
module.exports['test-stream-buffer-list.js'] = [
  [
    /require\('internal\/streams\/buffer_list'\);/,
    'require(\'../../lib/internal/streams/buffer_list\');'
  ]
]

module.exports['test-stream-transform-constructor-set-methods.js'] = [
  [
    /Error: _transform\\\(\\\) is n/,
    'Error: .*[Nn]'
  ]
]

module.exports['test-stream-unpipe-event.js'] = [
  [
    /^/,
    'if (process.version.indexOf(\'v0.8\') === 0) { process.exit(0) }\n'
  ]
]

module.exports['test-stream-readable-flow-recursion.js'] = [
  tapOk,
  deepStrictEqual
]

module.exports['test-stream-readable-with-unimplemented-_read.js'] = [
  deepStrictEqual
]

module.exports['test-stream-writable-needdrain-state.js'] = [
  deepStrictEqual
]

module.exports['test-stream-readable-setEncoding-null.js'] = [
  deepStrictEqual
]

module.exports['test-stream-pipeline.js'] = [
  [
    /require\('http2'\)/g,
    '{ createServer() { return { listen() {} } } }'
  ],
  [
    /assert\.deepStrictEqual\(err, new Error\('kaboom'\)\);/g,
    'assert.strictEqual(err.message, \'kaboom\');'
  ],
  [
    /cb\(new Error\('kaboom'\)\)/g,
    'process.nextTick(cb, new Error(\'kaboom\'))'
  ],
  [
    /const \{ promisify \} = require\('util'\);/g,
    'const promisify = require(\'util-promisify\');'
  ]
]

module.exports['test-stream-finished.js'] = [
  [
    /const \{ promisify \} = require\('util'\);/g,
    'const promisify = require(\'util-promisify\');'
  ]
]

module.exports['test-stream-readable-async-iterators.js'] = [
  [
    /assert.rejects\(/g,
    '(function(f, e) { let success = false; f().then(function() { success = true; throw new Error(\'should not succeeed\') }).catch(function(e2) { if (success) { throw e2; } assert.strictEqual(e.message, e2.message); })})('
  ],
  [
    /tests\(\).then\(common\.mustCall\(\)\)/,
    'tests().then(common.mustCall(), common.mustNotCall(console.log))'
  ],
  [
    /const AsyncIteratorPrototype = Object\.getPrototypeOf\(\n.*Object\.getPrototypeOf\(async function\* \(\) \{\}\).prototype\);/m,
    'const AsyncIteratorPrototype = Object\.getPrototypeOf(function () {})'
  ]
]

module.exports['test-readable-from.js'] = [
  [
      /const \{ once \} = require\('events'\);/
    , 'const once = require(\'events.once\');'
  ]
]
