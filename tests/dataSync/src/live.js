var async = require('async')
var now = require('./date').now
var src_query = require('./mysql').query
var dest_db = require('./mongo').db
var stations = require('./dict').stations
var levels = require('./dict').levels
var cache = require('./cache').cityHourly


exports.execute = () => {
    console.log(now(), 'schedule live start')
    var data = []
    async.series([
        c => src_query(`select * from AQIDataPublishLive where Timepoint =
         (select distinct Timepoint from AQIDataPublishLive order by Timepoint desc limit 1 );`,
            (err, res, fields) => {
                !err ? data = res : null
                c(err)
            }
        ),
        c => {
            var dataCityHourly = data.filter(e => e.StationCode.endswith('00'))
            async.parallel(dataCityHourly.map(e => c => dest_db().collection('dataCityHourly').update({
                Id: `${e.Timepoint}~${e.StationCode}`
            }, {
                $set: {
                    Id: `${e.Timepoint}~${e.StationCode}`,
                    AREA: e.Positionname,
                    CityCode: +e.StationCode,
                    TimePoint: e.Timepoint,
                    SO2: e.SO2,
                    NO2: e.NO2,
                    O3: e.O3,
                    CO: e.CO,
                    PM10: e.PM10,
                    PM2_5: e.PM2_5,
                    AQI: e.AQI,
                    Quality: levels[e.Quality] && levels[e.Quality].name || '-',
                    Measure: e.Measure,
                    Unheathful: e.Unheathful,
                    PrimaryPollutant: e.PrimaryPollutant
                }
            }, {
                upsert: true
            }, c)), c)
        },
        c => cache(c),
        c => {
            var dataStationHourly = data.filter(e => !e.StationCode.endswith('00'))
            async.parallel(dataStationHourly.map(e => c => dest_db().collection('dataStationHourly').update({
                Id: `${e.Timepoint}~${e.StationCode}`
            }, {
                $set: Object.assign(e, {
                    Id: `${e.Timepoint}~${e.StationCode}`,
                    stationCode: +stations()[e.StationCode],
                    monitorTime: e.Timepoint,
                    '100': +e.SO2,
                    '101': +e.NO2,
                    '102': +e.O3,
                    '103': +e.CO,
                    '104': +e.PM10,
                    '105': +e.PM2_5,
                    AQI: +e.AQI,
                    PRIMARYPOLLUTANT: e.PrimaryPollutant
                })
            }, {
                upsert: true
            }, c)), c)
        }
    ], err => err ? console.error(err.message) : console.log(now(), 'schedule live end'))
}