'use strict';

module.exports = function (cb) { 
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
        }
    }

    // Base on https://github.com/feross/queue-microtask/blob/master/index.js by feross
    if(typeof queueMicrotask === 'function') {
        queueMicrotask(()=>{
            cb.apply(null, args)
        }); 
    } else {
        Promise.resolve()
            .then(() => {
                cb.apply(null, args)
            })
            .catch(err => setTimeout(() => { throw err }, 0))
    }
};