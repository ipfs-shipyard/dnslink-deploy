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

  function getDomainRecord (domainName, domainRecordName, cb) {
    return api.domainRecordsGetAll(domainName, {per_page: 100}, function (err, data) {
      if (err) {
        cb('error: failed to fetch records for domain ' + domainName + ': ' + data.statusMessage);
      } else if (data.statusCode / 100 !== 2) {
        cb('error: failed to fetch records for domain ' + domainName + ': ' + data.statusMessage);
      } else {
        var records = data.body.domain_records
        for (var i = 0; i < records.length; i++) {
          if (records[i].name === domainRecordName && records[i].type === 'TXT') {
            cb(null, records[i])
            return
          }
        }
        console.log('error: record ' + domainRecordName + ' not found in domain ' + domainName);
      }
    })
  }

  function setDNS (domainName, domainRecordName, path) {
    getDomainRecord(domainName, domainRecordName, function (err, record) {
      if (err) {
        console.log(err)
      } else {
        console.log('Previous record: TXT ' + record.data)
        record.data = 'dnslink=' + path
        console.log('New record: TXT ' + record.data)
        api.domainRecordsUpdate(domainName, record.id, record, function (err, response) {
          if (err) {
            console.log('error: failed to update record ' + domainRecordName + ' for domain ' + domainName, err)
          } else {
            console.log(response.statusMessage)
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
