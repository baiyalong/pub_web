var schedule = require('node-schedule')
var async = require('async')
var live = require('./live')
var history = require('./history')

exports.execute = c => {
    try {
        live.execute()
        history.execute()

        schedule.scheduleJob('*/10 * * * * * ', () => live.execute())
        schedule.scheduleJob('*/10 * * * * * ', () => history.execute())
    } catch (error) {
        return c(error)
    }
    console.log('schedule execute')
    c(null)
}
