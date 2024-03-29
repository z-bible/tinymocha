'use strict'

var it, beforeEach
exports.beforeEach = function () {
  beforeEach.apply(this, arguments)
}
exports.it = function () {
  it.apply(this, arguments)
}
exports.spec = function () {
  it.apply(this, arguments)
}

var allSuitesDone = Promise.resolve()

exports.describe = function describe(name, fn) {
  return (allSuitesDone = allSuitesDone.then(function () {
    console.log('\n-------- Testing ' + name)
    if (!fn) return
    var hooks = { beforeEach: [] }
    beforeEach = function beforeEach(fn) {
      if (!fn) {
        console.error('No fn in beforeEach')
        return
      }
      hooks.beforeEach.push(fn)
    }
    var allCasesDone = Promise.resolve()
    it = function it(subName, fn) {
      var doIt = function doIt() {
        if (!fn) {
          console.warn(name + ' ' + subName + ' pending')
          return
        }
        var scope = {}

        return sequentially(
          hooks.beforeEach.map(function (fn) {
            return function () {
              return fn.apply(scope, [])
            }
          }),
        )
          .then(function () {
            return fn.apply(scope, [])
          })
          .then(
            function () {
              console.log(name + ' ' + subName + ' ok')
            },
            function (err) {
              console.error(name + ' ' + subName + ' failed')
              console.error(err)
              if (typeof process !== 'undefined') process.exitCode = 1
            },
          )
      }
      allCasesDone = allCasesDone.then(doIt)
    }
    try {
      fn()
      return allCasesDone
    } catch (err) {
      console.error(err)
      if (typeof process !== 'undefined') process.exitCode = 2
    }
  }))
}

function sequentially(fns) {
  return fns.reduce(function (p, fn) {
    return p.then(fn)
  }, Promise.resolve())
}

exports.assertEquals = function assertEquals(a, b, error) {
  if (a !== b) {
    if (error === undefined) error = a + ' !== ' + b
    throw new Error(error)
  }
}

exports.__esModule = true
