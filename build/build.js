#!/usr/bin/env node

const hyperquest  = require('hyperzip')(require('hyperdirect'))
    , bl          = require('bl')
    , fs          = require('fs')
    , path        = require('path')
    , cheerio     = require('cheerio')

    , files       = require('./files')
    , testReplace = require('./test-replacements')

    , srcurlpfx   = 'https://raw.githubusercontent.com/iojs/io.js/v' + process.argv[2] + '/'
    , libsrcurl   = srcurlpfx + 'lib/'
    , testsrcurl  = srcurlpfx + 'test/parallel/'
    , testlisturl = 'https://github.com/iojs/io.js/tree/v' + process.argv[2] + '/test/parallel'
    , libourroot  = path.join(__dirname, '../lib/')
    , testourroot = path.join(__dirname, '../test/parallel/')


if (!/\d\.\d\.\d+/.test(process.argv[2])) {
  console.error('Usage: build.js xx.yy.zz')
  return process.exit(1);
}

function processFile (url, out, replacements) {
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

function processLibFile (file) {
  var replacements = files[file]
    , url          = libsrcurl + file
    , out          = path.join(libourroot, file)

  processFile(url, out, replacements)
}


function processTestFile (file) {
  var replacements = testReplace.all
    , url          = testsrcurl + file
    , out          = path.join(testourroot, file)

  if (testReplace[file])
    replacements = replacements.concat(testReplace[file])

  processFile(url, out, replacements)
}


if (!/\d\.\d\.\d+/.test(process.argv[2])) {
  console.log('Usage: build.js <node version>')
  return process.exit(-1)
}


//--------------------------------------------------------------------
// Grab & process files in ../lib/

Object.keys(files).forEach(processLibFile)

//--------------------------------------------------------------------
// Discover, grab and process all test-stream* files on joyent/node

hyperquest(testlisturl).pipe(bl(function (err, data) {
  if (err)
    throw err

  var $ = cheerio.load(data.toString())

  $('table.files .js-directory-link').each(function () {
    var file = $(this).text()
    if (/^test-stream/.test(file))
      processTestFile(file)
  })
}))

//--------------------------------------------------------------------
// Grab the joyent/node test/common.js

processFile(
    testsrcurl.replace(/parallel\/$/, 'common.js')
  , path.join(testourroot, '../common.js')
  , testReplace['common.js']
)
