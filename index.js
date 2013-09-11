
var stream = require('stream');

if (stream.Readable) {
  module.exports = stream;
} else {
  module.exports = require('./readable.js');
}
