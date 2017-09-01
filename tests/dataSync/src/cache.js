var request = require('request')
var cache = require('../config').cache


exports.cityHourly = c => {
    if (cache.make)
        request(`${cache.url}/api/makeCache/rankList/now`, (err, resp, body) => err ? console.error(err.message) : null)
    c(null)
}

exports.cityDaily = c => {
    if (cache.make) {
        request(`${cache.url}/api/makeCache/rankList/lastMonth`, (err, resp, body) => err ? console.error(err.message) : null)
        request(`${cache.url}/api/makeCache/rankList/lastQuarter`, (err, resp, body) => err ? console.error(err.message) : null)
    }
    c(null)
}