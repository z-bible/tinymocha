/* global describe it beforeEach */
var TM = require('./index.js')
var expect = require('expect')
var JsMockito = require('jsmockito').JsMockito
var spy = JsMockito.spy
var verify = JsMockito.verify

var consoleLog = console.log
var consoleError = console.error

describe('describe', () => {
  beforeEach(() => {
    console.log = spy(consoleLog)
    console.error = spy(consoleError)
  })

  it("outputs <8 dashes> Testing <name>'", () =>
    TM.describe('hello', () => {}).then(() => {
      verify(console.log)('\n-------- Testing hello')
    }))
})

describe('it', () => {
  beforeEach(() => {
    console.log = spy(consoleLog)
    console.error = spy(consoleError)
  })

  it('executes the code', () =>
    TM.describe('hello', () => {
      TM.it('is said', () => {
        console.log('hello')
      })
    }).then(() => {
      verify(console.log)('hello')
    }))

  var demoError = Error('demo error')

  it('outputs success', () =>
    TM.describe('hello', () => {
      TM.it('is said', () => {
        console.log('hello')
      })
    }).then(() => {
      verify(console.log)('hello is said ok')
    }))

  it('outputs failures with error objects', () =>
    TM.describe('hello', () => {
      TM.it('is messed up', () => {
        throw demoError
      })
    }).then(() => {
      verify(console.error)('hello is messed up failed')
      verify(console.error)(demoError)
    }))

  it('can run two test cases with first one failing', () =>
    TM.describe('hello', () => {
      TM.it('is messed up', () => {
        throw demoError
      })
      TM.it('is said', () => {
        console.log('hello')
      })
    }).then(() => {
      verify(console.error)('hello is messed up failed')
      verify(console.error)(demoError)
      verify(console.log)('hello')
      verify(console.log)('hello is said ok')
    }))

  it('can be called spec', () =>
    TM.describe('hello', () => {
      TM.spec('is messed up', () => {
        throw demoError
      })
      TM.spec('is said', () => {
        console.log('hello')
      })
    }).then(() => {
      verify(console.error)('hello is messed up failed')
      verify(console.error)(demoError)
      verify(console.log)('hello')
      verify(console.log)('hello is said ok')
    }))
})

describe('beforeEach', () => {
  var c
  it('is run before each test case', () =>
    TM.describe('counter', () => {
      c = 1
      TM.beforeEach(() => {
        c *= 10
      })
      TM.it('adds 3', () => {
        c += 3
      })
      TM.it('adds 5', () => {
        c += 5
      })
      TM.it('adds 7', () => {
        c += 7
      })
      TM.it('results in 13570', () => {
        expect(c).toBe(13570)
      })
    }).then(() => {
      verify(console.log)('counter results in 13570 ok')
    }))

  it('can pass values to test cases', () => {
    TM.describe('hello', () => {
      TM.beforeEach(function () {
        this.c = 5
      })
      TM.it('works', function () {
        console.log(this.c)
      })
    }).then(function () {
      verify(console.log)(5)
    })
  })

  it('can pass values to next beforeEach handlers', () => {
    TM.describe('hello', () => {
      TM.beforeEach(function () {
        this.c = 5
      })
      TM.beforeEach(function () {
        console.log(this.c)
      })
      TM.it('works', function () {})
    }).then(() => {
      verify(console.log)(5)
    })
  })
})

describe('exitCode', () => {
  beforeEach(() => {
    process.exitCode = 0
  })
  it('is 0 for passing tests', () =>
    TM.describe('hello', () => {
      TM.it('works', () => {})
    }).then(() => {
      expect(process.exitCode).toBe(0)
    }))
  it('is 1 for failing tests', () =>
    TM.describe('hello', () => {
      TM.it('does not work', () => {
        window.hello()
      })
    }).then(() => {
      expect(process.exitCode).toBe(1)
    }))
  it('is 2 for invalid test suites', () =>
    TM.describe('hello', () => {
      window.hello()
    }).then(() => {
      expect(process.exitCode).toBe(2)
    }))
})

describe('DSL', () => {
  beforeEach(() => {
    console.log = spy(consoleLog)
    console.error = spy(consoleError)
  })

  it('function references can be saved', () => {
    const i = TM.it
    const d = TM.describe
    return d('hello', () => {
      i('works', () => {})
    }).then(() => {
      verify(console.log)('hello works ok')
    })
  })
})

describe('assertEquals', () => {
  it('throws when not equal', () => {
    expect(() => TM.assertEquals(4, 5)).toThrow('4 !== 5')
  })
  it('throws the message when not equal', () => {
    expect(() => TM.assertEquals(4, 5, 'Hey!')).toThrow('Hey!')
  })
  it('does not throw when equals', () => {
    expect(() => TM.assertEquals(4, 4)).toNotThrow()
  })
  it('does not throw when equals with message', () => {
    expect(() => TM.assertEquals(4, 4, 'Hey!')).toNotThrow()
  })
})
