'use strict';
var common = require('../common');
var Stream = require('stream').Stream;

module.exports = function (t) {
  t.test('Error Listener Catches', function (t) {
    t.plan(1);
    var source = new Stream();
    var dest = new Stream();

    source.pipe(dest);

    var gotErr = null;
    source.on('error', function(err) {
      gotErr = err;
    });

    var err = new Error('This stream turned into bacon.');
    source.emit('error', err);
    t.strictEqual(gotErr, err);
  });

  t.test('Error WithoutListener Throws', function (t) {
    t.plan(1);
    var source = new Stream();
    var dest = new Stream();

    source.pipe(dest);

    var err = new Error('This stream turned into bacon.');

    var gotErr = null;
    try {
      source.emit('error', err);
    } catch (e) {
      gotErr = e;
    }

    t.strictEqual(gotErr, err);
  });

  t.test('Error With Removed Listener Throws', function (t) {
    t.plan(2);
    var EE = require('events').EventEmitter;
    var R = require('../../').Readable;
    var W = require('../../').Writable;

    var r = new R();
    var w = new W();
    var removed = false;

    r._read = function() {
      setTimeout(function() {
        t.ok(removed);
        t.throws(function() {
          w.emit('error', new Error('fail'));
        });
      });
    };

    w.on('error', myOnError);
    r.pipe(w);
    w.removeListener('error', myOnError);
    removed = true;

    function myOnError(er) {
      throw new Error('this should not happen');
    }
  });

  t.test('Error With Removed Listener Throws', function (t) {
    t.plan(2);
    var EE = require('events').EventEmitter;
    var R = require('../../').Readable;
    var W = require('../../').Writable;

    var r = new R();
    var w = new W();
    var removed = false;
    var caught = false;

    r._read = function() {
      setTimeout(function() {
        t.ok(removed);
        w.emit('error', new Error('fail'));
      });
    };

    w.on('error', myOnError);
    w._write = function() {};

    r.pipe(w);
    // Removing some OTHER random listener should not do anything
    w.removeListener('error', function() {});
    removed = true;

    function myOnError(er) {
      t.notOk(caught);
      caught = true;
    }
  });
}
