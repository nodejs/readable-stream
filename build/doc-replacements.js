module.exports = [
  [
    /\]([\:|\(]\W?)([^\#]\w+\.html(?:#\w+))/g,
    `]$1https://iojs.org/dist/v${process.argv[2]}/doc/api/$2`
  ]
]
