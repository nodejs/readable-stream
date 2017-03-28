var Writable = require("./lib/_stream_writable.js")

if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  var Stream = (function (){
    try {
      return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
    } catch(_){}
  }());

  module.exports = Stream && Stream.Writable || Writable
}

module.exports = Writable
