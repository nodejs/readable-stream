
    'use strict'

    const tap = require('tap');
    const silentConsole = { log() {}, error() {} };
  ;

const common = require('../common');
const assert = require('assert');
const { Readable } = require('../../lib');

const MAX = 42;
const BATCH = 10;

{
  const readable = new Readable({
    objectMode: true,
    read: common.mustCall(function() {
      silentConsole.log('>> READ');
      fetchData((err, data) => {
        if (err) {
          this.destroy(err);
          return;
        }

        if (data.length === 0) {
          silentConsole.log('pushing null');
          this.push(null);
          return;
        }

        silentConsole.log('pushing');
        data.forEach((d) => this.push(d));
      });
    }, Math.floor(MAX / BATCH) + 2)
  });

  let i = 0;
  function fetchData(cb) {
    if (i > MAX) {
      setTimeout(cb, 10, null, []);
    } else {
      const array = [];
      const max = i + BATCH;
      for (; i < max; i++) {
        array.push(i);
      }
      setTimeout(cb, 10, null, array);
    }
  }

  readable.on('readable', () => {
    let data;
    silentConsole.log('readable emitted');
    while ((data = readable.read()) !== null) {
      silentConsole.log(data);
    }
  });

  readable.on('end', common.mustCall(() => {
    assert.strictEqual(i, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  const readable = new Readable({
    objectMode: true,
    read: common.mustCall(function() {
      silentConsole.log('>> READ');
      fetchData((err, data) => {
        if (err) {
          this.destroy(err);
          return;
        }

        if (data.length === 0) {
          silentConsole.log('pushing null');
          this.push(null);
          return;
        }

        silentConsole.log('pushing');
        data.forEach((d) => this.push(d));
      });
    }, Math.floor(MAX / BATCH) + 2)
  });

  let i = 0;
  function fetchData(cb) {
    if (i > MAX) {
      setTimeout(cb, 10, null, []);
    } else {
      const array = [];
      const max = i + BATCH;
      for (; i < max; i++) {
        array.push(i);
      }
      setTimeout(cb, 10, null, array);
    }
  }

  readable.on('data', (data) => {
    silentConsole.log('data emitted', data);
  });

  readable.on('end', common.mustCall(() => {
    assert.strictEqual(i, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  const readable = new Readable({
    objectMode: true,
    read: common.mustCall(function() {
      silentConsole.log('>> READ');
      fetchData((err, data) => {
        if (err) {
          this.destroy(err);
          return;
        }

        silentConsole.log('pushing');
        data.forEach((d) => this.push(d));

        if (data[BATCH - 1] >= MAX) {
          silentConsole.log('pushing null');
          this.push(null);
        }
      });
    }, Math.floor(MAX / BATCH) + 1)
  });

  let i = 0;
  function fetchData(cb) {
    const array = [];
    const max = i + BATCH;
    for (; i < max; i++) {
      array.push(i);
    }
    setTimeout(cb, 10, null, array);
  }

  readable.on('data', (data) => {
    silentConsole.log('data emitted', data);
  });

  readable.on('end', common.mustCall(() => {
    assert.strictEqual(i, (Math.floor(MAX / BATCH) + 1) * BATCH);
  }));
}

{
  const readable = new Readable({
    objectMode: true,
    read: common.mustNotCall()
  });

  readable.on('data', common.mustNotCall());

  readable.push(null);

  let nextTickPassed = false;
  process.nextTick(() => {
    nextTickPassed = true;
  });

  readable.on('end', common.mustCall(() => {
    assert.strictEqual(nextTickPassed, true);
  }));
}

{
  const readable = new Readable({
    objectMode: true,
    read: common.mustCall()
  });

  readable.on('data', (data) => {
    silentConsole.log('data emitted', data);
  });

  readable.on('end', common.mustCall());

  setImmediate(() => {
    readable.push('aaa');
    readable.push(null);
  });
}

  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(`test failed - exited code ${code}`);
    }
  });
  /* replacement end */
