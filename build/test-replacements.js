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

]

// this test has some trouble with the nextTick depth when run
// to stdout, it's also very noisy so we'll quiet it
module.exports['test-stream-pipe-multi.js'] = [
    [
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