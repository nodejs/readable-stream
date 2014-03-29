module.exports.altForEachImplReplacement = [
    /$/
  ,   '\nfunction forEach (xs, f) {\n'
    + '  for (var i = 0, l = xs.length; i < l; i++) {\n'
    + '    f(xs[i], i);\n'
    + '  }\n'
    + '}\n'
]

module.exports.altForEachUseReplacement = [
    /(\W)([\w\.\(\),\[\]]+)(\.forEach\()/gm
  , '$1forEach($2, '
]

module.exports.altIndexOfImplReplacement = [
    /$/
  ,   '\nfunction indexOf (xs, x) {\n'
    + '  for (var i = 0, l = xs.length; i < l; i++) {\n'
    + '    if (xs[i] === x) return i;\n'
    + '  }\n'
    + '  return -1;\n'
    + '}\n'
]

module.exports.altIndexOfUseReplacement = [
    /(\W)([\w\.\(\),\[\]]+)(\.indexOf\()/gm
  , '$1indexOf($2, '
]
