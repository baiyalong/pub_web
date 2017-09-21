var async = require('async')
var now = require('./date').now
var src_query = require('./mysql').query
var dest_db = require('./mongo').db
var stations = require('./dict').stations
var levels = require('./dict').levels
var cache = require('./cache').cityDaily


exports.execute = () => {
    console.log(now(), 'schedule history start')
    var data = []
    async.series([
        c => src_query(`select * from AQIDataPublishHistory_Day where Timepoint =
         (select distinct Timepoint from AQIDataPublishHistory_Day order by Timepoint desc limit 1 );`,
            (err, res, fields) => {
                !err ? data = res : null
                c(err)
            }
        ),
        c => {
            var dataCityDaily = data.filter(e => e.StationCode.endswith('00'))
            async.parallel(dataCityDaily.map(e => c => dest_db().collection('dataCityDaily').update({
                ID: `${e.Timepoint}~${e.StationCode}`
            }, {
                $set: Object.assign(e, {
                    ID: `${e.Timepoint}~${e.StationCode}`,
                    AREA: e.positionname,
                    MONITORTIME: e.Timepoint,
                    SO2: e.SO2,
                    NO2: e.NO2,
                    O3_1H: e.O3,
                    O3_8H: e.O3_8h,
                    CO: e.CO,
                    PM10: e.PM10,
                    PM2_5: e.PM2_5,
                    AQI: e.AQI_Hour,
                    TYPENAME: levels[e.Quality_Hour] && levels[e.Quality_Hour].name || '-',
                    LEVELNAME: levels[e.Quality_Hour] && levels[e.Quality_Hour].value || '-',
                    PRIMARYPOLLUTANT: e.PrimaryPollutant_Hour,
                    DESCRIPTION: e.Unhealthful,
                    CITYCODE: +e.StationCode
                })
            }, {
                upsert: true
            }, c)), c)
        },
        c => cache(c),
        c => {
            var dataStationDaily = data.filter(e => !e.StationCode.endswith('00'))
            async.parallel(dataStationDaily.map(e => c => dest_db().collection('dataStationDaily').update({
                ID: `${e.Timepoint}~${e.StationCode}`
            }, {
                $set: Object.assign(e, {
                    ID: `${e.Timepoint}~${e.StationCode}`,
                    STATIONCODE: e.StationCode,
                    STATIONNAME: e.positionname,
                    CITY: e.Area,
                    UNIQUECODE: stations()[e.StationCode],
                    MONITORTIME: e.Timepoint,
                    SO2: +e.SO2,
                    NO2: +e.NO2,
                    O3: +e.O3,
                    O3_8H: +e.O3_8H,
                    CO: +e.CO,
                    PM10: +e.PM10,
                    PM2_5: +e.PM2_5,
                    AQI: +e.AQI_Hour,
                    TYPE: levels[e.Quality_Hour] && levels[e.Quality_Hour].name || '-',
                    LEVEL: e.Quality_Hour,
                    PRIMARYPOLLUTANT: e.PrimaryPollutant_Hour,
                    DESCRIPTION: e.Unhealthful,
                    SO2_MARK: null,
                    NO2_MARK: null,
                    O3_MARK: null,
                    O3_8H_MARK: null,
                    CO_MARK: null,
                    PM10_MARK: null,
                    PM2_5_MARK: null,
                })
            }, {
                upsert: true
            }, c)), c)
        }
    ], err => err ? console.error(err.message) : console.log(now(), 'schedule history end'))
}