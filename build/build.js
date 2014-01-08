#!/usr/bin/env node

//_stream_duplex.js

const hyperquest = require('hyperzip')(require('hyperdirect'))
    , bl         = require('bl')
    , fs         = require('fs')
    , path       = require('path')

const urlprefix  = 'https://raw.github.com/joyent/node/v' + process.argv[2] + '-release/lib/'
    , outroot    = path.join(__dirname, '../lib/')
    , files      = require('./files')


function processFile (file) {
  var replacements = files[file]
    , url          = urlprefix + file
    , out          = path.join(outroot, file)

  hyperquest(url).pipe(bl(function (err, data) {
    if (err)
      throw err

    data = data.toString()
    replacements.forEach(function (replacement) {
      data = data.replace.apply(data, replacement)
    })

    fs.writeFile(out, data, 'utf8', function (err) {
      if (err)
        throw err

      console.log('Wrote', out)
    })
  }))
}


if (!/0\.1\d\.\d+/.test(process.argv[2])) {
  console.log('Usage: build.js <node version>')
  return process.exit(-1)
}

Object.keys(files).forEach(processFile)