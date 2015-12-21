Meteor.methods({
    exportStation: function () {
        return Station.find({}, { sort: { StationId: 1 }, fields: { _id: 0 } }).fetch()
    },
    exportCorrect: function (date, stationCode) {
        var dateFrom = new Date(date);
        dateFrom.setHours(0);
        dateFrom.setMinutes(0);
        dateFrom.setSeconds(0);
        dateFrom.setSeconds(dateFrom.getSeconds() - 1);
        var dateTo = new Date(dateFrom);
        dateTo.setDate(dateTo.getDate() + 1);
        return DataStationHourly.find({
            stationCode: Number(stationCode),
            monitorTime: { $gte: dateFrom, $lt: dateTo }
        }, { sort: { monitorTime: 1 }, fields: { _id: 0 } }).map(function (e) {
            return {
                stationCode: e.stationCode,
                monitorTime: moment(e.monitorTime).format('YYYY-MM-DD HH:mm:ss'),
                SO2: e[100],
                NO2: e[101],
                O3: e[102],
                CO: e[103],
                PM10: e[104],
                "PM2.5": e[105],
                NOx: e[106],
                NO: e[107],
                '风速': e[108],
                '风向': e[109],
                '气压': e[110],
                '气温': e[111],
                '湿度': e[112],
                '能见度': e[118],
                AQI: e.AQI
            }
        })
    },
    exportLimit: function () {
        return Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 }, fields: { _id: 0 } }).map(function (e) {
            // e.unit = e.unit || '';
            return e;
        })
    },
    exportWarning: function () {
        return Warning.find({}, { sort: { timestamp: -1 }, fields: { _id: 0 } }).map(function (e) {
            return {
                timestamp: moment(e.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                cityCode: e.cityCode,
                cityName: e.cityName,
                content: e.content
            }
        })
    },
    exportForecast: function () {
        return AirQuality.find({}, { sort: { date: -1 }, fields: { _id: 0 } }).map(function (e) {
            return {
                date: moment(e.date).format('YYYY-MM-DD'),
                cityCode: e.cityCode,
                cityName: e.cityName,
                areaCode: e.areaCode,
                areaName: e.areaName,
                applyTimestamp: moment(e.applyTimestamp).format('YYYY-MM-DD HH:mm:ss'),
                applyUser: e.applyUser,
                forecastDay_1_date: moment(e.applyContent.detail[0].date).format('YYYY-MM-DD'),
                forecastDay_1_primaryPollutant: e.applyContent.detail[0].primaryPollutant,
                forecastDay_1_airIndexLevel: e.applyContent.detail[0].airIndexLevel,
                forecastDay_1_airQualityIndex: e.applyContent.detail[0].airQualityIndex,
                forecastDay_1_visibility: e.applyContent.detail[0].visibility,
                forecastDay_2_date: e.applyContent.detail[1] ? moment(e.applyContent.detail[1].date).format('YYYY-MM-DD') : '',
                forecastDay_2_primaryPollutant: e.applyContent.detail[1] ? e.applyContent.detail[1].primaryPollutant : '',
                forecastDay_2_airIndexLevel: e.applyContent.detail[1] ? e.applyContent.detail[1].airIndexLevel : '',
                forecastDay_2_airQualityIndex: e.applyContent.detail[1] ? e.applyContent.detail[1].airQualityIndex : '',
                forecastDay_2_visibility: e.applyContent.detail[1] ? e.applyContent.detail[1].visibility : '',
                forecastDay_3_date: e.applyContent.detail[2] ? moment(e.applyContent.detail[2].date).format('YYYY-MM-DD') : '',
                forecastDay_3_primaryPollutant: e.applyContent.detail[2] ? e.applyContent.detail[2].primaryPollutant : '',
                forecastDay_3_airIndexLevel: e.applyContent.detail[2] ? e.applyContent.detail[2].airIndexLevel : '',
                forecastDay_3_airQualityIndex: e.applyContent.detail[2] ? e.applyContent.detail[2].airQualityIndex : '',
                forecastDay_3_visibility: e.applyContent.detail[2] ? e.applyContent.detail[2].visibility : '',
                forecastDescription: e.applyContent.description,
                statusCode: e.statusCode,
                statusName: e.statusName
            }
        })
    }
})