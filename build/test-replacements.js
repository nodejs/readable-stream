module.exports.all = [
    [
        /require\(['"]stream['"]\)/g
      , 'require(\'../../\')'
    ]

  , [
        /require\(['"](_stream_\w+)['"]\)/g
      , 'require(\'../../lib/$1\')'
    ]

]