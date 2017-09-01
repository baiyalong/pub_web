var async = require('async')
var mysql = require('./src/mysql')
var mongo = require('./src/mongo')
var schedule = require('./src/schedule')
var dict = require('./src/dict')

async.series([
    c => mysql.connect(c),
    c => mongo.connect(c),
    c => dict.init(c),
    c => schedule.execute(c)
], err => err ? console.error(err.message) : console.log('server start'))