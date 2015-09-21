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

  function getDomainRecordId (domainName, domainRecordName, cb) {
    return api.domainRecordsGetAll(domainName, {name: domainRecordName}, cb)
  }

  // TODO Set domainName and domainRecordID in env.
  function setDNS (domainName, domainRecordName, path) {
    getDomainRecordId(domainName, domainRecordName, function (err, data) {
      if (err) {
        console.log('No record ID found', err)
      } else {
        api.domainRecordsUpdate(domainName, data.id, {
          type: 'TXT',
          name: domainRecordName,
          data: 'dnslink=' + path
        }, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            console.log('Success:', data)
          }
        })
      }
    })
  }

  return {
    testAccountKey: testAccountKey,
    setDNS: setDNS
  }
}
