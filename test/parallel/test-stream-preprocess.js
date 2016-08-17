/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/
var common = require('../common');
var assert = require('assert/');

var fs = require('fs');
var path = require('path');
var rl = require('readline');

var BOM = '\uFEFF';

// Get the data using a non-stream way to compare with the streamed data.
var modelData = fs.readFileSync(path.join(common.fixturesDir, 'file-to-read-without-bom.txt'), 'utf8');
var modelDataFirstCharacter = modelData[0];

// Detect the number of forthcoming 'line' events for mustCall() 'expected' arg.
var lineCount = modelData.match(/\n/g).length;

// Ensure both without-bom and with-bom test files are textwise equal.
assert.strictEqual(fs.readFileSync(path.join(common.fixturesDir, 'file-to-read-with-bom.txt'), 'utf8'), '' + BOM + modelData);

// An unjustified BOM stripping with a non-BOM character unshifted to a stream.
var inputWithoutBOM = fs.createReadStream(path.join(common.fixturesDir, 'file-to-read-without-bom.txt'), 'utf8');

inputWithoutBOM.once('readable', common.mustCall(function () {
  var maybeBOM = inputWithoutBOM.read(1);
  assert.strictEqual(maybeBOM, modelDataFirstCharacter);
  assert.notStrictEqual(maybeBOM, BOM);

  inputWithoutBOM.unshift(maybeBOM);

  var streamedData = '';
  rl.createInterface({
    input: inputWithoutBOM
  }).on('line', common.mustCall(function (line) {
    streamedData += line + '\n';
  }, lineCount)).on('close', common.mustCall(function () {
    assert.strictEqual(streamedData, modelData);
  }));
}));

// A justified BOM stripping.
var inputWithBOM = fs.createReadStream(path.join(common.fixturesDir, 'file-to-read-with-bom.txt'), 'utf8');

inputWithBOM.once('readable', common.mustCall(function () {
  var maybeBOM = inputWithBOM.read(1);
  assert.strictEqual(maybeBOM, BOM);

  var streamedData = '';
  rl.createInterface({
    input: inputWithBOM
  }).on('line', common.mustCall(function (line) {
    streamedData += line + '\n';
  }, lineCount)).on('close', common.mustCall(function () {
    assert.strictEqual(streamedData, modelData);
  }));
}));