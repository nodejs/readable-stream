'use strict';

module.exports = function nextTick2 (cb) {
    var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null;
    var handle = function () {
        cb.apply(null, args);
    };

    // Base on https://github.com/feross/queue-microtask/blob/master/index.js by feross
    if(typeof queueMicrotask === 'function') {
        queueMicrotask(handle);
        return;
    }
    if (global.Promise === undefined) {
        Promise.resolve()
            .then(handle)
            .catch(function (err) {
                setTimeout(function () { throw err }, 0);
            });
        return;
    }
    setTimeout(handle, 0);
};
