var PassThrough = require("./lib/_stream_passthrough.js")

if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  var Stream = (function (){
    try {
      return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
    } catch(_){}
  }());

  module.exports = Stream && Stream.PassThrough || PassThrough
}

module.exports = PassThrough
