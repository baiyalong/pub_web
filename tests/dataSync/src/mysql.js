var mysql = require('mysql')
var config = require('../config').mysql
var connection

exports.connect = c => {
    connection = mysql.createConnection(config)
    connection.connect(err => {
        !err ? console.log('mysql connect') : null
        c(err)
    })
}

exports.close = c => connection.end(err => c ? c(err) : null)

exports.query = (sql, c) => connection.query(sql, c)