var Duplex = require("./lib/_stream_duplex.js")

if (!process.browser && process.env.READABLE_STREAM === 'disable') {
  var Stream = (function (){
    try {
      return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
    } catch(_){}
  }());

  module.exports = Stream && Stream.Duplex || Duplex
}

module.exports = Duplex
