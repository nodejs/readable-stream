#!/usr/bin/env node

const hyperquest  = require('hyperzip')(require('hyperdirect'))
    , bl          = require('bl')
    , fs          = require('fs')
    , path        = require('path')
    , cheerio     = require('cheerio')
    , encoding    = 'utf8'
    , nodeVersion = process.argv[2]
    , nodeVersionRegexString = '\\d+\\.\\d+\\.\\d+'
    , readmePath  = path.join(__dirname, '..', 'README.md')
    , files       = require('./files')
    , testReplace = require('./test-replacements')
    , docReplace  = require('./doc-replacements')

    , srcurlpfx   = `https://raw.githubusercontent.com/nodejs/node/v${nodeVersion}/`
    , libsrcurl   = srcurlpfx + 'lib/'
    , testsrcurl  = srcurlpfx + 'test/parallel/'
    , testlisturl = `https://github.com/nodejs/node/tree/v${nodeVersion}/test/parallel`
    , libourroot  = path.join(__dirname, '../lib/')
    , testourroot = path.join(__dirname, '../test/parallel/')
    , docurlpfx   = `https://raw.githubusercontent.com/nodejs/node/v${nodeVersion}/doc/api/`
    , docourroot  = path.join(__dirname, '../doc')


if (!RegExp('^' + nodeVersionRegexString + '$').test(nodeVersion)) {
  console.error('Usage: build.js xx.yy.zz')
  return process.exit(1);
}

// `inputLoc`: URL or local path.
function processFile (inputLoc, out, replacements) {
  var file = /^https?:\/\//.test(inputLoc) ?
    hyperquest(inputLoc) :
    fs.createReadStream(inputLoc, encoding)

  file.pipe(bl(function (err, data) {
    if (err) throw err

    data = data.toString()
    replacements.forEach(function (replacement) {
      data = data.replace.apply(data, replacement)
    })

    fs.writeFile(out, data, encoding, function (err) {
      if (err) throw err

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

//--------------------------------------------------------------------
// Grab & process files in ../lib/

Object.keys(files).forEach(processLibFile)

//--------------------------------------------------------------------
// Discover, grab and process all test-stream* files on nodejs/node

hyperquest(testlisturl).pipe(bl(function (err, data) {
  if (err)
    throw err

  var $ = cheerio.load(data.toString())

  $('table.files .js-directory-link').each(function () {
    var file = $(this).text()
    if (/^test-stream/.test(file) && !/-wrap\.js$/.test(file))
      processTestFile(file)
  })
}))

processFile(docurlpfx + 'stream.markdown', path.join(docourroot, 'stream.markdown'), docReplace)


//--------------------------------------------------------------------
// Grab the nodejs/node test/common.js

processFile(
    testsrcurl.replace(/parallel\/$/, 'common.js')
  , path.join(testourroot, '../common.js')
  , testReplace['common.js']
)

//--------------------------------------------------------------------
// Update Node version in README

processFile(readmePath, readmePath, [
  [
      RegExp('(Node-core v)' + nodeVersionRegexString, 'g')
    , "$1" + nodeVersion
  ]
])
