/**
 * Created by bai on 2015/9/6.
 */
BLL.mobile = {

  areaSubscribe: function () {
    var area = Area.find({}, { sort: { code: 1 }, fields: { _id: 0, weatherID: 0 } }).fetch()
    return area.filter(function (e) {
      return e.code % 1000 != 0 && e.code % 100 == 0;
    }).map(function (e) {
      e.areaArray = area.filter(function (ee) {
        return ee.code > e.code && ee.code < (e.code + 100)
      }).slice(0, 1)
      return e;
    })
  },
  cityBasic: function (id) {
    var code = parseInt(id)
    if (code < 10000) {
      code *= 100
    }
    var city = Area.findOne({
      code: {
        $eq: code
      }
    })
    var weather = Weather.findOne({
      areaid: city.weatherID
    });
    var f = weather.content.f.f1[0];
    var zone = Area.find({
      code: {
        $gt: Math.floor(code / 100) * 100,
        $lt: (Math.floor(code / 100) + 1) * 100
      }
    }, {
        fields: {
          code: 1,
          _id: 0
        }
      }).map(function (e) {
        return e.code
      })

    return {
      cityId: city.code,
      cityName: city.name,
      weather: f.fa || f.fb,
      temperature: (f.fc || f.fd) + '℃',
      zoneIdArray: [zone[0]]
    }
  },
  areaDetail: function (id) {
    var code = parseInt(id)
    var area = Area.findOne({
      code: {
        $eq: code
      }
    })
    if (!area) return;
    var weather = Weather.findOne({
      areaid: area.weatherID
    });
    var f = weather.content.f.f1;
    var num = function () {
      return Math.floor(Math.random() * 500);
    }
    var healthyAdrr = function (aqi) {
      var l = 0;
      if (aqi <= 100) l = 0;
      else if (aqi > 100 && aqi <= 150) l = 1;
      else if (aqi > 150 && aqi <= 200) l = 2;
      else if (aqi > 200) l = 3
      return [l, l, l, l]
    }
    var aqi = num();
    var day = function (n) {
      var date = new Date();
      date.setDate(date.getDate() + n);
      return moment(date).format('MM月DD日')
    }
    var weekday = function (n) {
      var date = new Date();
      date.setDate(date.getDate() + n);
      var res = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return res[date.getDay()];
    }
    var res = {
      areaId: area.code,
      areaName: area.name,
      weather: f[0].fa || f[0].fb,
      windDirection: f[0].fe || f[0].ff,
      windPower: f[0].fg || f[0].fh,
      temperature: (f[0].fc || f[0].fd) + '℃',
      aqi: aqi,
      //aqiLevel: 0,
      pollutantLevel: [{
        type: 105,
        name: 'PM2.5',
        value: num() + 'μg/m³'
      }, {
          type: 104,
          name: 'PM10',
          value: num() + 'μg/m³'
        }, {
          type: 102,
          name: 'O₃',
          value: num() + 'μg/m³'
        }, {
          type: 100,
          name: 'SO₂',
          value: num() + 'μg/m³'
        }, {
          type: 101,
          name: 'NO₂',
          value: num() + 'μg/m³'
        }, {
          type: 103,
          name: 'CO',
          value: num() + 'μg/m³'
        }, ],
      healthyAdviceList: healthyAdrr(aqi),
      aqPridictionList: (function () {
        return DataAirQuality.find({ areaCode: code, date: { $gt: new Date() } }).map(function (e) {
          return [
            moment(e.date).format('MM月DD日'),
            (function (value) {
              return ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'][(function () {
                if (value > 0 && value <= 50) return 0;
                if (value > 50 && value <= 100) return 1;
                if (value > 100 && value <= 150) return 2;
                if (value > 150 && value <= 200) return 3;
                if (value > 200 && value <= 300) return 4;
                if (value > 300) return 5;
              })()]
            })(e.airQualityIndex),
            (function (code) {
              return ['SO₂', 'NO₂', 'O₃', 'CO', 'PM2.5', 'PM10'][code % 100]
            })(e.primaryPollutant)
          ]
        })
      })(),
      airQualityPridiction: (function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        var d1 = new Date(date);
        d1.setSeconds(d1.getSeconds() - 1);
        var d2 = new Date(date);
        d2.setSeconds(d2.getSeconds() + 1);
        var data = DataAirQuality.findOne({ areaCode: code, date: { $gt: d1, $lt: d2 } });
        return data ? data.description : null;
      })(),
      weatherPridiction: (function () {
        var res = [{
          date: weekday(0) + '白天',
          weather: f[0].fa,
          temperature: f[0].fc + '℃',
          windDirection: f[0].fe,
          windPower: f[0].fg
        }, {
            date: weekday(0) + '晚上',
            weather: f[0].fb,
            temperature: f[0].fd + '℃',
            windDirection: f[0].ff,
            windPower: f[0].fh
          }, {
            date: weekday(1) + '白天',
            weather: f[1].fa,
            temperature: f[1].fc + '℃',
            windDirection: f[1].fe,
            windPower: f[1].fg
          }, {
            date: weekday(1) + '晚上',
            weather: f[1].fb,
            temperature: f[1].fd + '℃',
            windDirection: f[1].ff,
            windPower: f[1].fh
          }, {
            date: weekday(2) + '白天',
            weather: f[2].fa,
            temperature: f[2].fc + '℃',
            windDirection: f[2].fe,
            windPower: f[2].fg
          }, {
            date: weekday(2) + '晚上',
            weather: f[2].fb,
            temperature: f[2].fd + '℃',
            windDirection: f[2].ff,
            windPower: f[2].fh
          }, ]
        if (!f[0].fa)
          res.shift();
        return res;
      })(),
    }

    code = Math.floor(code / 100) * 100;
    var real = DataCityHourly.findOne({
      CityCode: code
    }, {
        sort: {
          TimePoint: -1
        }
      });
    if (real) {
      res.aqi = parseInt(real.AQI);
      res.healthyAdviceList = healthyAdrr(parseInt(real.AQI))
      res.pollutantLevel = [{
        type: 105,
        name: 'PM2.5',
        value: parseInt(real.PM2_5) + 'μg/m³'
      }, {
          type: 104,
          name: 'PM10',
          value: parseInt(real.PM10) + 'μg/m³'
        }, {
          type: 102,
          name: 'O₃',
          value: parseInt(real.O3) + 'μg/m³'
        }, {
          type: 100,
          name: 'SO₂',
          value: parseInt(real.SO2) + 'μg/m³'
        }, {
          type: 101,
          name: 'NO₂',
          value: parseInt(real.NO2) + 'μg/m³'
        }, {
          type: 103,
          name: 'CO',
          value: parseInt(real.CO * 1000) + 'μg/m³'
        }, ]
    }
    return res;
  },
  cityHistory: function (param) {
    var type = function (timeInterval) {
      var aqiType = parseInt(param.aqiType);
      if (timeInterval == 0) {
        if (aqiType == 90) return 'AQI';
        if (aqiType == 100) return 'SO2';
        if (aqiType == 101) return 'NO2';
        if (aqiType == 102) return 'O3';
        if (aqiType == 103) return 'CO';
        if (aqiType == 104) return 'PM10';
        if (aqiType == 105) return 'PM2_5';
      } else if (timeInterval == 1) {
        if (aqiType == 90) return 'AQI';
        if (aqiType == 100) return 'SO2';
        if (aqiType == 101) return 'NO2';
        if (aqiType == 102) return 'O3_1H';
        if (aqiType == 103) return 'CO';
        if (aqiType == 104) return 'PM10';
        if (aqiType == 105) return 'PM2_5';
      }
    }
    return {
      areaId: parseInt(param.areaId),
      aqiType: parseInt(param.aqiType), //AQI:90
      timeInterval: parseInt(param.timeInterval),
      aqiHistory: (function (timeInterval) {
        var arr = [];
        var cityCode = Math.floor(parseInt(param.areaId) / 100) * 100;
        if (parseInt(timeInterval) == 0) //hour
        {
          var data = DataCityHourly.find({ CityCode: cityCode }, { sort: { TimePoint: -1 }, limit: 100 }).fetch();
          data.forEach(function (e) {
            e['CO'] = Math.floor(e['CO'] * 1000);
          })
          var day1 = moment(data[0].TimePoint).format('YYYY-MM-DD');
          var arr1 = [];
          var t1 = data[0];
          while (moment(t1.TimePoint).format('YYYY-MM-DD') == day1) {
            arr1.push(moment(t1.TimePoint).format('HH') + '@' + t1[type(0)]);
            data.shift();
            t1 = data[0];
          }
          arr.push({
            date: day1,
            aqi: arr1.reverse()
          })

          var day2 = moment(data[0].TimePoint).format('YYYY-MM-DD');
          var arr2 = [];
          var t2 = data[0];
          while (moment(t2.TimePoint).format('YYYY-MM-DD') == day2) {
            arr2.push(moment(t2.TimePoint).format('HH') + '@' + t2[type(0)]);
            data.shift();
            t2 = data[0];
          }
          arr.push({
            date: day2,
            aqi: arr2.reverse()
          })

          var day3 = moment(data[0].TimePoint).format('YYYY-MM-DD');
          var arr3 = [];
          var t3 = data[0];
          while (moment(t3.TimePoint).format('YYYY-MM-DD') == day3) {
            arr3.push(moment(t3.TimePoint).format('HH') + '@' + t3[type(0)]);
            data.shift();
            t3 = data[0];
          }
          arr.push({
            date: day3,
            aqi: arr3.reverse()
          })

          // arr.reverse();
        } else if (parseInt(timeInterval) == 1) //day
        {
          var data = DataCityDaily.find({ CITYCODE: cityCode.toString() }, { sort: { MONITORTIME: -1 }, limit: 100 }).fetch();
          data.forEach(function (e) {
            e['CO'] = Math.floor(e['CO'] * 1000);
          })
          var day1 = moment(data[0].MONITORTIME).format('YYYY-MM');
          var arr1 = [];
          var t1 = data[0];
          while (moment(t1.MONITORTIME).format('YYYY-MM') == day1) {
            arr1.push(moment(t1.MONITORTIME).format('DD') + '@' + t1[type(1)]);
            data.shift();
            t1 = data[0];
          }
          arr.push({
            date: day1,
            aqi: arr1.reverse()
          })

          var day2 = moment(data[0].MONITORTIME).format('YYYY-MM');
          var arr2 = [];
          var t2 = data[0];
          while (moment(t2.MONITORTIME).format('YYYY-MM') == day2) {
            arr2.push(moment(t2.MONITORTIME).format('DD') + '@' + t2[type(1)]);
            data.shift();
            t2 = data[0];
          }
          arr.push({
            date: day2,
            aqi: arr2.reverse()
          })

          var day3 = moment(data[0].MONITORTIME).format('YYYY-MM');
          var arr3 = [];
          var t3 = data[0];
          while (moment(t3.MONITORTIME).format('YYYY-MM') == day3) {
            arr3.push(moment(t3.MONITORTIME).format('DD') + '@' + t3[type(1)]);
            data.shift();
            t3 = data[0];
          }
          arr.push({
            date: day3,
            aqi: arr3.reverse()
          })

          // arr.reverse();
        }
        return arr.reverse();
      })(param.timeInterval)
    }
  },
  stationMonitor: function (id) {
    // var num = function () {
    //   return Math.floor(Math.random() * 500)
    // }
    return {
      areaId: parseInt(id),
      stationMonitor: (function (id) {
        return Station.find({
          countyCode: id
        }, {
            sort: {
              UniqueCode: 1
            },
            fields: {
              UniqueCode: 1,
              PositionName: 1
            }
          }).map(function (e) {
            var data = DataStationHourly.findOne({ stationCode: e.UniqueCode }, { sort: { monitorTime: -1 } })
            return {
              code: e.UniqueCode,
              name: e.PositionName,
              topPollution: 'PM2.5',
              aqi: data['AQI'],
              pm25: data['105'],
              pm10: data['104'],
              o3: data['102'],
              so2: data['100'],
              no2: data['101'],
              co: data['103'] * 1000,
            }
          })
      })(parseInt(id))
    }
  },
  getLatestVersion: function (deviceType) {
    var app = MobileApp.findOne({
      deviceType: deviceType
    }, {
        sort: {
          timestamp: -1
        }
      })
    return {
      deviceType: app.deviceType,
      latestVersion: app.version,
      downloadUrl: (function (app) {
        if (deviceType == 'IOS') {
          return app.conf;
        } else {
          return FileFS.findOne({
            _id: app.app
          }).url();
        }
        //var id = deviceType == 'IOS' ? app.conf : app.app;
        //return FileFS.findOne({_id: id}).url();
      })(app),
      description: app.description || ''
    }
  },
  map: function (level) {
    var res = [];
    var rand = function () {
      return Math.floor(Math.random() * 500)
    }
    var healthAdvice = function (aqi) {
      var res = [
        '各类人群可正常活动',
        '极少数异常敏感人群应减少户外活动',
        '儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼',
        '疾病患者避免长时间、高强度的户外锻练，一般人群适量减少户外运动',
        '儿童、老年人和心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动',
        '儿童、老年人和病人应当留在室内，避免体力消耗，一般人群应避免户外活动'];
      var l = 0;
      if (aqi <= 50) l = 0;
      else if (aqi > 50 && aqi <= 100) l = 1;
      else if (aqi > 100 && aqi <= 150) l = 2;
      else if (aqi > 150 && aqi <= 200) l = 3;
      else if (aqi > 200 && aqi <= 300) l = 4;
      else if (aqi > 300) l = 5
      return res[l];
    }
    switch (parseInt(level)) {
      case 0:
        {
          res = Area.find({
            $and: [{
              code: {
                $mod: [100, 0]
              }
            }, {
                code: {
                  $not: {
                    $mod: [10000, 0]
                  }
                }
              }]
          }, {
              sort: {
                code: 1
              }
            }).map(function (e) {
              var data = DataCityHourly.findOne({ CityCode: e.code }, { sort: { TimePoint: -1 } });
              return {
                code: e.code,
                name: e.name,
                longitude: e.longitude,
                latitude: e.latitude,
                aqi: Number(data['AQI']),
                PM25: Number(data['PM2_5']),
                PM10: Number(data['PM10']),
                O3: Number(data['O3']),
                SO2: Number(data['SO2']),
                NO2: Number(data['NO2']),
                CO: Number(data['CO']) * 1000,
                timestamp: moment(data.TimePoint).format('YYYY-MM-DD HH:mm:ss'),
                airQualityLevel: data['Quality'],
                primaryPollutant: data['PrimaryPollutant'],
                healthAdvice: healthAdvice(Number(data['AQI']))
              }
            })
          break;
        }
      case 1:
      // {
      //   res = Area.find({
      //     code: {
      //       $not: {
      //         $mod: [100, 0]
      //       }
      //     }
      //   }, {
      //       sort: {
      //         code: 1
      //       }
      //     }).map(function (e) {
      //       return {
      //         code: e.code,
      //         name: e.name,
      //         longitude: e.longitude,
      //         latitude: e.latitude,
      //         aqi: rand(),
      //         PM25: rand(),
      //         PM10: rand(),
      //         O3: rand(),
      //         SO2: rand(),
      //         NO2: rand(),
      //         CO: rand(),
      //         timestamp: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      //       }
      //     })
      //   break;
      // }
      case 2:
        {
          res = Station.find().map(function (e) {
            var data = DataStationHourly.findOne({ stationCode: e.UniqueCode }, { sort: { monitorTime: -1 } });
            return {
              code: e.UniqueCode,
              name: e.PositionName,
              longitude: e.Longitude,
              latitude: e.Latitude,
              aqi: data['AQI'],
              PM25: data['105'],
              PM10: data['104'],
              O3: data['102'],
              SO2: data['100'],
              NO2: data['101'],
              CO: data['103'] * 1000,
              timestamp: moment(data.monitorTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        }
      default:
        { }
    }
    return res;
  },
  pollutantLimit: function () {
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
      PM25: fun(105),
      PM10: fun(104),
      O3: fun(102),
      SO2: fun(100),
      NO2: fun(101),
      CO: fun(103)
    }
  },
  rank: function (day) {
    return Area.find({
      code: {
        $not: {
          $mod: [100, 0]
        }
      }
    }).fetch().filter(function (e) {
      return e.code % 100 == 1
    }).map(function (e) {
      var res = {
        cityCode: Math.floor(e.code / 100) * 100,
        cityName: Area.findOne({
          code: Math.floor(e.code / 100) * 100
        }).name,
        countyCode: e.code,
        countyName: e.name,
      }
      if (parseInt(day) == 0) {
        var data = DataCityHourly.findOne({ CityCode: res.cityCode }, { sort: { TimePoint: -1 } })
        res.aqi = Number(data['AQI']);
        res.PM25 = Number(data['PM2_5']);
        res.PM10 = Number(data['PM10']);
        res.O3 = Number(data['O3']);
        res.SO2 = Number(data['SO2']);
        res.NO2 = Number(data['NO2']);
        res.CO = Math.floor(Number(data['CO']) * 1000);
      } else {
        var data = DataCityDaily.find({ CITYCODE: res.cityCode.toString() }, { sort: { MONITORTIME: -1 }, limit: parseInt(day) }).fetch()
        var sum = data.reduce(function (p, c, i, a) {
          var arr = ['AQI', 'PM2_5', 'PM10', 'O3_1H', 'SO2', 'NO2', 'CO']
          var res = {}
          arr.forEach(function (e) {
            res[e] = p[e] + c[e]
          })
          return res;
        })
        var avg = function (e) { return Math.round(e / Number(day)) }
        res.aqi = avg(sum['AQI']);
        res.PM25 = avg(sum['PM2_5']);
        res.PM10 = avg(sum['PM10']);
        res.O3 = avg(sum['O3_1H']);
        res.SO2 = avg(sum['SO2']);
        res.NO2 = avg(sum['NO2']);
        res.CO = avg(sum['CO'] * 1000);
      }
      return res;
    }).sort(function (a, b) {
      return a.aqi - b.aqi;
    })
  },
  terminalStatus: function (req) {
    //console.log('req,', req)
    if (req && req.ID && req.ID != '(null)' && req.OS) {
      Terminal.upsert({
        ID: req.ID
      }, {
          $set: req
        });
      return 200;
    } else
      return 400;
  }
}
