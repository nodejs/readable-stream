#!/usr/bin/env node

const hyperquest  = require('hyperzip')(require('hyperdirect'))
    , bl          = require('bl')
    , fs          = require('fs')
    , path        = require('path')
    , cheerio     = require('cheerio')
    , babel       = require('babel-core')
    , encoding    = 'utf8'
    , urlRegex = /^https?:\/\//
    , nodeVersion = process.argv[2]
    , nodeVersionRegexString = '\\d+\\.\\d+\\.\\d+'
    , usageVersionRegex = RegExp('^' + nodeVersionRegexString + '$')
    , readmeVersionRegex =
        RegExp('((?:Node-core )|(?:https\:\/\/nodejs\.org\/dist\/)v)' + nodeVersionRegexString, 'g')

    , readmePath  = path.join(__dirname, '..', 'README.md')
    , files       = require('./files')
    , testReplace = require('./test-replacements')

    , srcurlpfx   = `https://raw.githubusercontent.com/nodejs/node/v${nodeVersion}/`
    , libsrcurl   = srcurlpfx + 'lib/'
    , testsrcurl  = srcurlpfx + 'test/parallel/'
    , testlisturl = `https://github.com/nodejs/node/tree/v${nodeVersion}/test/parallel`
    , libourroot  = path.join(__dirname, '../lib/')
    , testourroot = path.join(__dirname, '../test/parallel/')


if (!usageVersionRegex.test(nodeVersion)) {
  console.error('Usage: build.js xx.yy.zz')
  return process.exit(1);
}

// `inputLoc`: URL or local path.
function processFile (inputLoc, out, replacements) {
  var file = urlRegex.test(inputLoc) ?
    hyperquest(inputLoc) :
    fs.createReadStream(inputLoc, encoding)

  file.pipe(bl(function (err, data) {
    if (err) throw err

    data = data.toString()
    replacements.forEach(function (replacement) {
      data = data.replace.apply(data, replacement)
    })
    if (inputLoc.slice(-3) === '.js') {
      const transformed = babel.transform(data, {
        plugins: [
          'transform-es2015-parameters',
          'transform-es2015-arrow-functions',
          'transform-es2015-block-scoping',
          'transform-es2015-template-literals',
          'transform-es2015-shorthand-properties',
          'transform-es2015-for-of',
          'transform-es2015-destructuring'
        ]
      })
      data = transformed.code
    }
    fs.writeFile(out, data, encoding, function (err) {
      if (err) throw err

      console.log('Wrote', out)
    })
  }))
}
function deleteOldTests(){
  const files = fs.readdirSync(path.join(__dirname, '..', 'test', 'parallel'));
  for (let file of files) {
    let name = path.join(__dirname, '..', 'test', 'parallel', file);
    console.log('removing', name);
    fs.unlinkSync(name);
  }
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

// delete the current contents of test/parallel so if node removes any tests
// they are removed here
deleteOldTests();

//--------------------------------------------------------------------
// Discover, grab and process all test-stream* files on nodejs/node

hyperquest(testlisturl).pipe(bl(function (err, data) {
  if (err)
    throw err

  var $ = cheerio.load(data.toString())

  $('table.files .js-navigation-open').each(function () {
    var file = $(this).text()
    if (/^test-stream/.test(file) && !/-wrap(?:-encoding)?\.js$/.test(file) && file !== 'test-stream2-httpclient-response-end.js' && file !== 'test-stream-base-no-abort.js' && file !== 'test-stream-preprocess.js' && file !== 'test-stream-inheritance.js')
      processTestFile(file)
  })
}))


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
  [readmeVersionRegex, "$1" + nodeVersion]
])
