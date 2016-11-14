# Tinymocha

This is a minimalistic version of the Mocha test framework, with a DSL that is
a subset of the Mocha DSL.

## Installation

    npm install tinymocha

and in your code:

    import {describe, it, beforeEach} from "tinymocha"
    
or

    var tinymocha = require("tinymocha");
    var describe = tinymocha.describe
    var it = tinymocha.it
    var beforeEach = tinymocha.beforeEach

The rest is just Mocha syntax.

## Features

Tinymocha can be used either in the browser or or in Node. In Node it properly sets `process.exitCode`,
so it can be used in test frameworks and CI.

It only supports one-level deep `describe` blocks. So no `describe` in `describe` is supported.

Tinymocha outputs results of test cases and headings of test suites by `console.log` and  `console.error`  calls.

Asynchronity is supported but only with promises (not with `done` callbacks). So just as in Mocha,
test cases can return Promise objects (or [thenables](https://promisesaplus.com/)) and Tinymocha will
wait for them to be resolved or rejected.

## Participation

Bug reports, feature requests and pull requests are welcome on GitHub :)

## License

MIT

