'use strict'

let debugUtil
try {
  debugUtil = require('util')
} catch (e) {
  // No-op
}

module.exports = {
  inherits: require('inherits'),
  debuglog: debugUtil?.debuglog ? debugUtil.debuglog : () => function () {},
  once(callback) {
    let called = false

    return function (...args) {
      if (called) {
        return
      }
      called = true
      callback.apply(this, args)
    }
  },
  // Simplified version of https://nodejs.org/api/util.html#utilformatformat-args
  format(format, ...args) {
    return format.replace(/%([sdifj])/g, function (...[_unused, type]) {
      const replacement = args.shift()

      if (type === 'f') {
        return replacement.toFixed(6)
      } else if (type === 'j') {
        return JSON.stringify(replacement)
      } else {
        return replacement.toString()
      }
    })
  },
  promisify: function (fn) {
    return new Promise((resolve, reject) => {
      fn((err, ...args) => {
        if (err) {
          return reject(err)
        }

        return resolve(...args)
      })
    })
  }
}
