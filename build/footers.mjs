const testTicksDisableHook = `
  /* replacement start */
  process.on('beforeExit', (code) => {
    hook.disable();
  });
  /* replacement end */
`

const testParallel = `
  /* replacement start */
  process.on('beforeExit', (code) => {
    if(code === 0) {
      tap.pass('test succeeded');
    } else {
      tap.fail(\`test failed - exited code \${code}\`);
    }
  });
  /* replacement end */
`

export const footers = {
  'test/parallel/test-stream-writable-samecb-singletick.js': testTicksDisableHook,
  'test/parallel/.+': testParallel
}
