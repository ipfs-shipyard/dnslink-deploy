#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2), {
  alias: {t: 'test'}
})

var setDNSLib = require('../lib')({
  DOApiKey: process.env.DIGITAL_OCEAN
})

if (argv['test']) {
  setDNSLib.testAccountKey(argv['test'])
} else {
  console.log('No argument supplied.')
  process.exit(1)
}
