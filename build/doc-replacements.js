module.exports = [
  [
    /\]([\:|\(]\W?)([^\#]\w+\.html(?:#\w+))/g,
    `]$1https://nodejs.org/docs/v${process.argv[2]}/api/$2`
  ]
]
