Meteor.methods({
    importStation: function (dataList) {
        return dataList.map(function (e) {
            var res = null;
            try {
                var area = Area.find().fetch();
                res = Station.upsert({ UniqueCode: Number(e.UniqueCode) }, { $set: { 
                    StationId: Number(e.StationId),
                    PositionName: e.PositionName,
                    Area: e.Area,
                    UniqueCode: Number(e.UniqueCode),
                    StationCode: e.StationCode,
                    Longitude: Number(e.Longitude),
                    Latitude: Number(e.Latitude),
                    enableStatus: e.enableStatus,
                    publishStatus: e.publishStatus,
                    countyCode: Number(e.countyCode),
                    countyName: (function () {
                        //   var county = area.filter(function(e){return e.code==Number(e.countyCode)})[0]
                        //   return county?county.name:'';
                        var county = Area.findOne({ code: Number(e.countyCode) })
                        return county ? county.name : '';
                    })()
                    } })
            } catch (err) {
                res = null;
                console.log(err)
            } finally {
                e.res = res ? true : false;
            }
            return e;
        })
    },
    importCorrect: function (dataList) {
        return dataList.map(function (e) {
            var res = null;
            try {
                 res = DataStationHourly.upsert({ stationCode: Number(e.stationCode),monitorTime:{
                     $gt:(function(){
                         var d = new Date(e.monitorTime);
                         d.setMinutes(d.getMinutes()-1);
                         return d;
                         })(),
                     $lt:(function(){
                         var d = new Date(e.monitorTime);
                         d.setMinutes(d.getMinutes() + 1);
                         return d;
                     })()
                 } }, { $set: { 
                         stationCode: Number(e.stationCode),
                         monitorTime: new Date(e.monitorTime),
                         '100':Number(e['SO2']),
                         '101':Number(e['NO2']),
                         '102':Number(e['O3']),
                         '103':Number(e['CO']),
                         '104':Number(e['PM10']),
                         '105':Number(e['PM2.5']),
                         '106':Number(e['NOx']),
                         '107':Number(e['NO']),
                         '108':Number(e['风速']),
                         '109':Number(e['风向']),
                         '110':Number(e['气压']),
                         '111':Number(e['气温']),
                         '112':Number(e['湿度']),
                         '118':Number(e['能见度']),
                         'AQI':Number(e['AQI']),
                  } })
            } catch (err) {
                res = null;
                console.log(err)
            } finally {
                e.res = res ? true : false;
            }
            return e;
        })
    },
    importLimit: function (dataList) {
        return dataList.map(function (e) {
            var res = null;
            try {
                res = Pollutant.update({ pollutantCode: Number(e.pollutantCode) }, { $set: { limit: Number(e.limit) } })
            } catch (err) {
                res = null;
                console.log(err)
            } finally {
                e.res = res ? true : false;
            }
            return e;
        })
    },
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