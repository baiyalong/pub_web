/**
 * Created by bai on 2015/9/11.
 */

BLL.www = {
    area: function () {
        return Area.find({}, { sort: { code: 1 }, fields: { _id: 0, weatherID: 0 } }).fetch()
    },
    airQualityForcast: function () {
        return {
            title: '内蒙古自治区污染预报',
            content: '12月8日起，我区多地再遭雾霾伏击。12月9日，呼和浩特市政府发布空气质量蓝色预警：受不利的大气扩散条件影响，12月9日、11~12日，全市空气质量可能出现重度污染。同时，自治区气象局发布消息，预计未来3天，我区河套地区、中东部偏南及西部偏南地区雾、霾天气仍将持续，空气质量以中度、重度污染为主',
            detail: (function () {
                var res = [];
                for (var i = 1; i <= 3; i++) {
                    res.push({
                        date: (function () {
                            var date = new Date();
                            date.setDate(date.getDate() + i);
                            return moment(date).format('MM月DD日');
                        })(),
                        value: (function () {
                            var date = new Date();
                            date.setHours(0);
                            date.setMinutes(0);
                            date.setSeconds(0);
                            date.setDate(date.getDate() + i);
                            var d1 = new Date(date);
                            d1.setSeconds(d1.getSeconds() - 1);
                            var d2 = new Date(date);
                            d2.setSeconds(d2.getSeconds() + 1);
                            return DataAirQuality.find({ date: { $gt: d1, $lt: d2 } }, { sort: { cityCode: 1 } })
                                .map(function (e) {
                                    return {
                                        code: Math.floor(e.areaCode / 100) * 100,
                                        name: Area.findOne({ code: Math.floor(e.areaCode / 100) * 100 }).name,
                                        primaryPollutant: (function (code) {
                                            return ['SO2', 'NO2', 'O3', 'CO', 'PM2.5', 'PM10'][code % 100]
                                        })(e.primaryPollutant),
                                        airQualityLevel: (function (code) {
                                            return ['一级', '二级', '三级', '四级', '五级', '六级'][code - 1]
                                        })(e.airIndexLevel),
                                        airQualityClass: (function (value) {
                                            return ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'][(function () {
                                                if (value > 0 && value <= 50) return 0;
                                                if (value > 50 && value <= 100) return 1;
                                                if (value > 100 && value <= 150) return 2;
                                                if (value > 150 && value <= 200) return 3;
                                                if (value > 200 && value <= 300) return 4;
                                                if (value > 300) return 5;
                                            })()]
                                        })(e.airQualityIndex),
                                        airQualityValue: e.airQualityIndex,
                                        visibility: e.visibility
                                    }
                                });
                        })()
                    })
                }
                return res;
            })()
        }
    },
    cityDetail: function (id) {
        id = parseInt(id)
        var city = Area.findOne({ code: id })
        var pollutant = ['AQI', 'PM2.5', 'PM10', 'O3', 'CO', 'SO2', 'NO2'];
        var day = function (n) {
            var date = new Date();
            date.setDate(date.getDate() + n);
            return moment(date).format('MM月DD日')
        }
        var data = DataCityHourly.findOne({ CityCode: id }, { sort: { TimePoint: -1 } })
        return {
            cityCode: city.code,
            cityName: city.name,
            airQualityRealTime: {
                time: moment(data.TimePoint).format('YYYY-MM-DD HH:mm:ss'),
                aqi: Number(data['AQI']),
                level: data['Quality']
            },
            airQualityForecast: [
                {
                    time: day(1),
                    airQuality: '优到良',
                    primaryPollutant: 'PM2.5'
                }, {
                    time: day(2),
                    airQuality: '优到良',
                    primaryPollutant: 'PM2.5'
                }
            ],
            pollutantLimit: (function () {
                var arr = Pollutant.find({
                    $and: [{
                        pollutantCode: {
                            $gte: 90
                        }
                    }, {
                            pollutantCode: {
                                $lte: 105
                            }
                        }]
                }, {
                        sort: {
                            pollutantCode: 1
                        }
                    }).fetch();
                var fun = function (code) {
                    return arr.filter(function (e) {
                        return e.pollutantCode == code
                    })[0].limit;
                }
                return {
                    AQI: fun(90),
                    'PM2.5': fun(105),
                    PM10: fun(104),
                    O3: fun(102),
                    SO2: fun(100),
                    NO2: fun(101),
                    CO: fun(103)
                }
            })()
            ,
            pollutant24hour: (function (arr) {
                var data = DataCityHourly.find({ CityCode: id }, { sort: { TimePoint: -1 }, limit: 24 })
                var res = {};
                arr.forEach(function (e) {
                    res[e] = data.map(function (ee) {
                        return {
                            time: moment(ee.TimePoint).format('YYYY-MM-DD HH:mm'),
                            value: (function () {
                                if (e == 'PM2.5') return Number(ee['PM2_5']);
                                if (e == 'CO') return Number(ee['CO']) * 1000;
                                else return Number(ee[e]);
                            })()
                        }
                    });
                    res[e].reverse();
                })
                return res;
            })(pollutant),
            pollutant60day: (function (arr) {
                var data = DataCityDaily.find({ CITYCODE: id.toString() }, { sort: { MONITORTIME: -1 }, limit: 60 })
                var res = {};
                arr.forEach(function (e) {
                    res[e] = data.map(function (ee) {
                        return {
                            date: moment(ee.MONITORTIME).format('YYYY-MM-DD'),
                            value: (function () {
                                if (e == 'PM2.5') return ee['PM2_5'];
                                else if (e == 'O3') return ee['O3_1H'];
                                if (e == 'CO') return Number(ee['CO']) * 1000;
                                else return ee[e];
                            })()
                        }
                    })
                    res[e].reverse();
                })
                return res;
            })(pollutant),
            monitorStationList: (function (arr) {
                return Station.find({ $and: [{ UniqueCode: { $gt: id * 1000 } }, { UniqueCode: { $lt: (id + 1) * 1000 } }] }, {
                    sort: { UniqueCode: 1 },
                    fields: { UniqueCode: 1, PositionName: 1 }
                }).map(function (e) {
                    var data = DataStationHourly.findOne({ stationCode: e.UniqueCode }, { sort: { monitorTime: -1 } })
                    return {
                        code: e.UniqueCode,
                        name: e.PositionName,
                        AQI: data['AQI'],
                        "PM2.5": data['105'],
                        PM10: data['104'],
                        O3: data['102'],
                        CO: data['103'] * 1000,
                        SO2: data['100'],
                        NO2: data['101']
                    };
                })
            })(pollutant)
        }
    }
}