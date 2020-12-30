module.exports.all = [
  [
    /(require\(['"])(stream)/g,
    '$1../../readable-deno.js',
  ],
  [
    /(require\(['"])(\.\.\/common)/g,
    '$1../common-deno.js',
  ],
];

module.exports['test-stream3-pause-then-read.js'] = [
  
]