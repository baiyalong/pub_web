/**
 * Created by bai on 2015/8/21.
 */
//΢�Žӿ�

//1,login

//2,logout

//3,subscribe

//4,getData


//5,pushData


Api.addRoute('weinxi_areaList', {
    get: function () {
        return Meteor.call('areaList')
    }
})

Api.addRoute('areaList', {
    get: function () {
        return Meteor.call('areaList', this.queryParams)
    }
})

Meteor.methods({
    areaList: function (params) {
        {
            var areaIdList = params.ids;
            areaIdList = areaIdList ? areaIdList.split('-').map(function (e) {
                return Math.floor(Number(e) / 100) * 100;
            }) : null;


            var res = []

            Area.find({}, { sort: { code: 1 }, fields: { code: 1, name: 1, weatherID: 1 } })
                .forEach(function (e) {
                    if (e.code == 150000) { }
                    else if (Math.floor(e.code / 100) * 100 == e.code) {
                        res.push({
                            cityCode: e.code,
                            cityName: e.name,
                            areaList: []
                        })
                    }
                    else if (e.code % 100 == 1 || e.code == 152502 || e.code == 152921) {
                        if (e.code == 152501) {

                        } else {
                            res.find(function (ee) {
                                return ee.cityCode / 100 == Math.floor(e.code / 100)
                            }).areaList.push({
                                areaCode: e.code,
                                areaName: e.name,
                                weatherId: e.weatherID
                            })
                        }

                    }
                })

            var weather = Weather.find({
                areaid: {
                    $in: res.map(function (e) {
                        return e.areaList[0].weatherId
                    })
                }
            }, {}).fetch();

            var data = DataCityHourly.find({
                CityCode: {
                    $in: res.map(function (e) {
                        return e.cityCode;
                    })
                }
            }, { sort: { TimePoint: -1 }, limit: res.length }).fetch();

            res = res.map(function (e) {
                var d = data.filter(function (ee) { return ee.CityCode == e.cityCode })[0];
                var f = weather.filter(function (ee) {
                    return ee.areaid == e.areaList[0].weatherId
                })[0].content.f.f1;

                e.areaList[0].aqi = d.AQI;
                e.areaList[0].primaryPollutant = Meteor.call('primaryPollutant_filter', d.PrimaryPollutant);

                e.areaList[0].weather = f[0].fa || f[0].fb;
                e.areaList[0].windDirection = f[0].fe || f[0].ff;
                e.areaList[0].windPower = f[0].fg || f[0].fh;
                e.areaList[0].temperature = (f[0].fc || f[0].fd) + '℃';

                return e;
            });

            if (areaIdList) {
                res = res.filter(function (e) {
                    return areaIdList.indexOf(e.cityCode) != -1;
                })
            }

            return res;
        }
    }
})