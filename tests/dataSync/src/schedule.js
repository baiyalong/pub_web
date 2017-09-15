var schedule = require('node-schedule')
var async = require('async')
var live = require('./live')
var history = require('./history')

exports.execute = c => {
    try {
        live.execute()
        history.execute()

        schedule.scheduleJob('0 */5 * * * * * ', () => live.execute())
        schedule.scheduleJob('0 */5 * * * * * ', () => history.execute())
    } catch (error) {
        return c(error)
    }
    console.log('schedule execute')
    c(null)
}
