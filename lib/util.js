'use strict'

module.exports = {
  debuglog() {
    return function () {}
  },
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
  promisify: function (fn) {
    return new Promise((resolve, reject) => {
      fn((err, ...args) => {
        if (err) {
          return reject(err)
        }
        return resolve(...args)
      })
    })
  },
  createDeferredPromise: function () {
    let resolve
    let reject

    // eslint-disable-next-line promise/param-names
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    return { promise, resolve, reject }
  },
  isError(err) {
    return err instanceof Error
  },
  ...require('util').types,
  // isAsyncFunction,
  // isArrayBufferView,
  // isRegExp,
  // isDate,

  // isAnyArrayBuffer,
  // isDataView,
  // isPromise,
  // isWeakSet,
  // isWeakMap,
  // isModuleNamespaceObject,
  // isBoxedPrimitive,
  // isExternal,
  // isArgumentsObject,
  // isGeneratorFunction,
  // Keep in sync with https://github.com/nodejs/node/blob/master/typings/internalBinding/util.d.ts
  propertyFilter: {
    ALL_PROPERTIES: 0,
    ONLY_ENUMERABLE: 2
  },
  // The following methods are not 100% accurate, but there are no equivalent on user-land JS outside of V8
  getProxyDetails(proxy) {
    return undefined
  },
  getConstructorName(obj) {
    return obj !== 'undefined' ? 'undefined' : obj.constructor?.name ?? 'Object'
  },
  getOwnNonIndexProperties(obj) {
    return Object.getOwnPropertyNames(obj)
  },
  join(arr, separator) {
    return arr.join(separator)
  }
}

module.exports.promisify.custom = Symbol.for('nodejs.util.promisify.custom')
