#!/usr/bin/env node

const hyperquest  = require('hyperquest')
    , bl          = require('bl')
    , fs          = require('fs')
    , path        = require('path')
    , tar         = require('tar-fs')
    , gunzip      = require('gunzip-maybe')
    , babel       = require('babel-core')
    , glob        = require('glob')
    , pump        = require('pump')
    , rimraf      = require('rimraf')
    , encoding    = 'utf8'
    , urlRegex    = /^https?:\/\//
    , nodeVersion = process.argv[2]
    , nodeVersionRegexString = '\\d+\\.\\d+\\.\\d+'
    , usageVersionRegex = RegExp('^' + nodeVersionRegexString + '$')
    , readmeVersionRegex =
        RegExp('((?:Node-core )|(?:https\:\/\/nodejs\.org\/dist\/)v)' + nodeVersionRegexString, 'g')

    , readmePath  = path.join(__dirname, '..', 'README.md')
    , files       = require('./files')
    , testReplace = require('./test-replacements')

    , downloadurl = `https://nodejs.org/dist/v${nodeVersion}/node-v${nodeVersion}.tar.gz`
    , src         = path.join(__dirname, `node-v${nodeVersion}`)
    , libsrcurl   = path.join(src, 'lib/')
    , testsrcurl  = path.join(src, 'test/parallel/')
    , libourroot  = path.join(__dirname, '../lib/')
    , testourroot = path.join(__dirname, '../test/parallel/')


if (!usageVersionRegex.test(nodeVersion)) {
  console.error('Usage: build.js xx.yy.zz')
  return process.exit(1);
}

// `inputLoc`: URL or local path.
function processFile (inputLoc, out, replacements) {
  var file = fs.createReadStream(inputLoc, encoding)

  file.pipe(bl(function (err, data) {
    if (err) throw err

    console.log('Processing', inputLoc)
    data = data.toString()
    replacements.forEach(function (replacement) {
      const regexp = replacement[0]
      var arg2 = replacement[1]
      if (typeof arg2 === 'function')
        arg2 = arg2.bind(data)
      data = data.replace(regexp, arg2)
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
          'transform-es2015-classes',
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
    console.log('Removing', name);
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
// Download the release from nodejs.org
console.log(`Downloading ${downloadurl}`)
pump(
  hyperquest(downloadurl),
  gunzip(),
  tar.extract(__dirname),
  function (err) {
    if (err) {
      throw err
    }


    //--------------------------------------------------------------------
    // Grab & process files in ../lib/

    Object.keys(files).forEach(processLibFile)


    //--------------------------------------------------------------------
    // Discover, grab and process all test-stream* files on the given release

    glob(path.join(testsrcurl, 'test-stream*.js'), function (err, list) {
      if (err) {
        throw err
      }

      list.forEach(function (file) {
        file = path.basename(file)
        if (!/-wrap(?:-encoding)?\.js$/.test(file) &&
            file !== 'test-stream2-httpclient-response-end.js' &&
            file !== 'test-stream-base-no-abort.js' &&
            file !== 'test-stream-preprocess.js' &&
            file !== 'test-stream-inheritance.js') {
          processTestFile(file)
        }
      })
    })


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
  }
)

// delete the current contents of test/parallel so if node removes any tests
// they are removed here
deleteOldTests();

process.once('beforeExit', function () {
  rimraf(src, function (err) {
    if (err) {
      throw err
    }

    console.log('Removed', src)
  })
})
