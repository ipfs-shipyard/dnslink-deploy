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
      var records = data.body.domain_records;
      for (var i = 0; i < records.length; i++) {
        if (records[i].name === domainRecordName && records[i].type === 'TXT') {
          cb(null, records[i]);
          return;
        }
      }
      cb('not_found');
    })
  }

  function setDNS (domainName, domainRecordName, path) {
    getDomainRecord(domainName, domainRecordName, function (err, record) {
      if (err) {
        console.log('getDomainRecord() failed', err)
      } else {
        console.log(record);
        record.data = 'dnslink=' + path;
        api.domainRecordsUpdate(domainName, record.id, record, function (err, response) {
          if (err) {
            console.log('domainRecordsUpdate() failed', err)
          } else {
            console.log(response.statusCode, response.body)
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
