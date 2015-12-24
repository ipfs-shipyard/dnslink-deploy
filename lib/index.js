var DigitalOcean = require('do-wrapper')
var Promise = require('bluebird')
var http = require('http')
var isSuccess = require('is-success')
var isRedirect = require('is-redirect')

module.exports = function initializeModule (options) {
  var api = Promise.promisifyAll(new DigitalOcean(options.DOApiKey, 10))

  function testAccountKey () {
    api.account(function (err, res, body) {
      if (err) { console.log(err) }
      console.log(body)
    })
  }

  function testHash (path, cb) {
    return http.get({
        host: 'ipfs.io',
        port: 80,
        path: path
      }, function (res) {
        if (isSuccess(res.statusCode) || isRedirect(res.statusCode)) {
          console.log('Got status code: ' + res.statusCode)
          return cb(null, res.statusCode)
        } else {
          return cb('Hash invalid: check hash')
        }
      }).on('error', function (e) {
        return cb('Got error: ' + e.message)
      })
  }

  function getDomainRecord (domainName, domainRecordName, cb) {
    return api.domainRecordsGetAll(domainName, {per_page: 100}, function (err, data) {
      if (err || data.body.id === 'not_found') {
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
    setDNS: setDNS,
    testHash: testHash
  }
}
