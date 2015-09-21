#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    t: 'test',
    d: 'domain', // domainName
    r: 'record',  // domainRecordName,
    p: 'path'    // path
  }
})

var setDNSLib = require('../lib')({
  DOApiKey: process.env.DIGITAL_OCEAN
})

if (argv['test']) {
  setDNSLib.testAccountKey(argv['test'])
} else if (argv['d'] && argv['p'] && argv['r']) {
  setDNSLib.setDNS(argv['d'], argv['r'], argv['p'])
} else {
  console.log('Insuffienct arguments supplied.')
  console.log('Please provide: domain, record, and path.')
  process.exit(1)
}
