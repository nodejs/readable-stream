#!/usr/bin/env node

const hyperquest  = require('hyperquest')
    , bl          = require('bl')
    , fs          = require('fs')
    , path        = require('path')
    , tar         = require('tar-fs')
    , gunzip      = require('gunzip-maybe')
    , babel       = require('@babel/core')
    , glob        = require('glob')
    , pump        = require('pump')
    , rimraf      = require('rimraf')
    , encoding    = 'utf8'
    , urlRegex    = /^https?:\/\//
    , nodeVersion = process.argv[2]
    , nodeVersionRegexString = '\\d+\\.\\d+\\.\\d+'
    , usageVersionRegex = RegExp('^' + nodeVersionRegexString + '$')
    , readmeVersionRegex =
        RegExp('((?:(?:Node-core )|(?:https\:\/\/nodejs\.org\/dist\/))v)' + nodeVersionRegexString, 'g')

    , readmePath  = path.join(__dirname, '..', 'README.md')
    , files       = require('./files')
    , nodeTestReplacements = require('./test-replacements')
    , denoTestReplacements = require('./deno-replacements')
    , downloadurl = `http://localhost/node-v10.19.0.tar.gz`
    //, downloadurl = `https://nodejs.org/dist/v${nodeVersion}/node-v${nodeVersion}.tar.gz`
    , src         = path.join(__dirname, `node-v${nodeVersion}`)
    , libsrcurl   = path.join(src, 'lib/')
    , testSourcePath  = path.join(src, 'test/parallel/')
    , libourroot  = path.join(__dirname, '../lib/')
    , testnoderoot = path.join(__dirname, '../test/parallel/')
    , testdenoroot = path.join(__dirname, '../test/deno/')


if (!usageVersionRegex.test(nodeVersion)) {
  console.error('Usage: build.js xx.yy.zz')
  return process.exit(1);
}

// `inputLoc`: URL or local path.
function transformFileToNode (inputLoc, out, replacements, addAtEnd) {
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
      if (arg2 === undefined) {
        console.error('missing second arg for file', inputLoc, replacement)
        throw new Error('missing second arg in replacement')
      }
      data = data.replace(regexp, arg2)
    });

    if (addAtEnd) {
      data += addAtEnd
    }
    if (inputLoc.slice(-3) === '.js') {
      try {
        const transformed = babel.transform(data, {
          // Required for babel to pick up .babelrc
          filename: inputLoc
        })
        data = transformed.code
      } catch (err) {
        fs.writeFile(out + '.errored.js', data, encoding, function () {
          console.log('Wrote errored', out)

          throw err
        })
        return
      }
    }
    fs.writeFile(out, data, encoding, function (err) {
      if (err) throw err

      console.log('Wrote', out)
    })
  }))
}
function transformTestFileToDeno (inputLoc, out, replacements) {
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
      if (arg2 === undefined) {
        console.error('missing second arg for file', inputLoc, replacement)
        throw new Error('missing second arg in replacement')
      }
      data = data.replace(regexp, arg2)
    });
    if (inputLoc.slice(-3) === '.js') {
      try {
        const transformed = babel.transform(data, {
          presets: [],
          plugins: ["transform-commonjs"],
        });
        data = transformed.code
      } catch (err) {
        fs.writeFile(out + '.errored.js', data, encoding, function () {
          console.log('Wrote errored', out)

          throw err
        })
        return
      }
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
    const node_test = path.join(__dirname, '..', 'test', 'parallel', file);
    const deno_test = path.join(__dirname, '..', 'test', 'deno', file);
    try{
      fs.unlinkSync(node_test);
      console.log('Removed', node_test);
    }catch(e){
      console.log('Not found', node_test);
    }
    try{
      fs.unlinkSync(deno_test);
      console.log('Removed', deno_test);
    }catch(e){
      console.log('Not found', deno_test);
    }
  }
}
function processLibFile (file) {
  var replacements = files[file]
    , url          = libsrcurl + file
    , out          = path.join(libourroot, file)

  transformFileToNode(url, out, replacements)
}


function processNodeTestFile (file) {
  // Process node tests
  let node_replacements = nodeTestReplacements.all;
  const  node_url             = testSourcePath + file
  ,      node_out             = path.join(testnoderoot, file);

  if (nodeTestReplacements[file])
    node_replacements = node_replacements.concat(nodeTestReplacements[file])

  transformFileToNode(node_url, node_out, node_replacements, ';(function () { var t = require(\'tap\'); t.pass(\'sync run\'); })();var _list = process.listeners(\'uncaughtException\'); process.removeAllListeners(\'uncaughtException\'); _list.pop(); _list.forEach((e) => process.on(\'uncaughtException\', e));')
}

function processDenoTestFile(file){
  let deno_replacements = denoTestReplacements.all;
  const  deno_url             = testSourcePath + file
  ,      deno_out             = path.join(testdenoroot, file);

  if (denoTestReplacements[file])
    deno_replacements = deno_replacements.concat(denoTestReplacements[file]);

  transformTestFileToDeno(deno_url, deno_out, deno_replacements)
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

    glob(path.join(testSourcePath, 'test-@(stream|readable)*.js'), function (err, list) {
      if (err) {
        throw err
      }

      list.forEach(function (file) {
        file = path.basename(file)
        if (!/-wrap(?:-encoding)?\.js$/.test(file) &&
            file !== 'test-stream2-httpclient-response-end.js' &&
            file !== 'test-stream-base-no-abort.js' &&
            file !== 'test-stream-preprocess.js' &&
            file !== 'test-stream-inheritance.js' &&
            file !== 'test-stream-base-prototype-accessors.js' &&
            file !== 'test-stream-base-prototype-accessors-enumerability.js'  &&
            file !== 'test-stream-wrap-drain.js' &&
            file !== 'test-stream-pipeline-http2.js' &&
            file !== 'test-stream-base-typechecking.js') {
          processNodeTestFile(file);
          processDenoTestFile(file);
        }
      })
    })

    //--------------------------------------------------------------------
    // Grab the nodejs/node test/common.js

  glob(path.join(src, 'test/common/*'), function (err, list) {
      if (err) {
        throw err
      }

      list.forEach(function (file) {
        file = path.basename(file)
        transformFileToNode(
            path.join(testSourcePath.replace(/parallel[/\\]$/, 'common/'), file)
          , path.join(testnoderoot.replace('parallel', 'common'), file)
          , nodeTestReplacements['common.js']
        )
      })
    })

    //--------------------------------------------------------------------
    // Update Node version in README
    transformFileToNode(readmePath, readmePath, [
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
