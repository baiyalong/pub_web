var MongoClient = require('mongodb').MongoClient
var config = require('../config').mongo
var db

exports.connect = c => {
    MongoClient.connect(config, (err, res) => {
        if (!err && res) {
            console.log('mongo connect')
            db = res
        }
        c(err)
    })
}

exports.close = () => db.close()

exports.db = () => db