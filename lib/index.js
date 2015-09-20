var DigitalOcean = require('do-wrapper')
var Promise = require('bluebird')

module.exports = function initializeModule (options) {
  var api = Promise.promisifyAll(new DigitalOcean(options.DOApiKey, 10))

  function testAccountKey () {
    api.account(function (err, res, body) {
      if (err) { console.log(err) }
      console.log(body)
    })
  }

  // TODO Set domainName and domainRecordID in env.
  function setDNS (domainName, domainRecordId, domainRecordName, path) {
    api.domainRecordsUpdate(domainName, domainRecordId, {
      type: 'TXT',
      name: domainRecordName,
      data: 'dnslink='+path
    }, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('Success:', data)
      }
    })
  }

  return {
    testAccountKey: testAccountKey,
    setDNS: setDNS
  }
}
