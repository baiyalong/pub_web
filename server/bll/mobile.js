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
            if (e.code == 152500) return ee.code > e.code + 1 && ee.code < (e.code + 100)
            else return ee.code > e.code && ee.code < (e.code + 100)
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
    var code = Number(id)
    if(code%100==0)return {err:'error param!'}
    var area = Area.findOne({
      code: {
        $eq: code
      }
    })
    if (!area) return { err: 'area not found!' };
    
    var limit = (function () {
        var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
    })();

    function filter(name, value) {
        return Math.min(value, limit[name])
    }
        
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
            e.airIndexLevel,
            e.primaryPollutant
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
        return data ? data.description : '';
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
      res.aqi = filter('AQI',Number(real.AQI));
      res.healthyAdviceList = healthyAdrr(Number(real.AQI))
      res.pollutantLevel = [{
          type: 105,
          name: 'PM2.5',
          value: filter('PM2.5', Number(real.PM2_5)) + 'μg/m³'
      }, {
              type: 104,
              name: 'PM10',
              value: filter('PM10', Number(real.PM10)) + 'μg/m³'
          }, {
              type: 102,
              name: 'O₃',
              value: filter('O3', Number(real.O3)) + 'μg/m³'
          }, {
              type: 100,
              name: 'SO₂',
              value: filter('SO2', Number(real.SO2)) + 'μg/m³'
          }, {
              type: 101,
              name: 'NO₂',
              value: filter('NO2', Number(real.NO2)) + 'μg/m³'
          }, {
              type: 103,
              name: 'CO',
              value: filter('CO', Math.floor(Number(real.CO) * 1000)) + 'μg/m³'
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
     var limit = (function () {
            var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
        })();
        
     function filter(value) {
         var name = null;
         var aqiType = parseInt(param.aqiType);
         if (aqiType == 90) name = 'AQI';
         if (aqiType == 100) name = 'SO2';
         if (aqiType == 101) name = 'NO2';
         if (aqiType == 102) name = 'O3';
         if (aqiType == 103) name = 'CO';
         if (aqiType == 104) name = 'PM10';
         if (aqiType == 105) name = 'PM2.5';
         return Math.min(value, limit[name])
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
          var data = DataCityHourly.find({ CityCode: cityCode }, { sort: { TimePoint: -1 }, limit: 7*24 }).fetch();
          data.forEach(function (e) {
            e['CO'] = Math.floor(e['CO'] * 1000);
          })
          
          while(data.length!=0) {
              var day = moment(data[0].TimePoint).format('YYYY-MM-DD');
              var arr1 = [];
              var t = data[0];
              while (t&&moment(t.TimePoint).format('YYYY-MM-DD') == day) {
                  arr1.push(moment(t.TimePoint).format('HH') + '@' + filter(t[type(0)]));
                  data.shift();
                  t = data[0];
              }
              arr.push({
                  date: day,
                  aqi: arr1.reverse()
              })
          }

          // arr.reverse();
        } else if (parseInt(timeInterval) == 1) //day
        {
          var data = DataCityDaily.find({ CITYCODE: cityCode.toString() }, { sort: { MONITORTIME: -1 }, limit: 60 }).fetch();
          data.forEach(function (e) {
            e['CO'] = Math.floor(e['CO'] * 1000);
          })
          var day1 = moment(data[0].MONITORTIME).format('YYYY-MM');
          var arr1 = [];
          var t1 = data[0];
          while (moment(t1.MONITORTIME).format('YYYY-MM') == day1) {
            arr1.push(moment(t1.MONITORTIME).format('DD') + '@' + filter(t1[type(1)]));
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
            arr2.push(moment(t2.MONITORTIME).format('DD') + '@' + filter(t2[type(1)]));
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
          while (t3&&moment(t3.MONITORTIME).format('YYYY-MM') == day3) {
            arr3.push(moment(t3.MONITORTIME).format('DD') + '@' + filter(t3[type(1)]));
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
             var limit = (function () {
            var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
        })();
        
        function filter(name,value){
            return Math.min(value,limit[name])
        }
    return {
      areaId: parseInt(id),
      stationMonitor: (function (id) {
        return Station.find({
          countyCode: id,
          enableStatus: true,
          publishStatus: true
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
              aqi: filter('AQI',data['AQI']),
              pm25: filter('PM2.5',data['105']),
              pm10: filter('PM10',data['104']),
              o3: filter('O3',data['102']),
              so2: filter('SO2',data['100']),
              no2: filter('NO2',data['101']),
              co: filter('CO',Math.floor(Number(data['103']) * 1000)),
            }
          })
      })(parseInt(id))
    }
  },
  getLatestVersion: function (deviceType,host) {
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
          return app.conf || 'http://'+host+FileFS.findOne({
            _id: app.app
          }).url();
        }
        //var id = deviceType == 'IOS' ? app.conf : app.app;
        //return FileFS.findOne({_id: id}).url();
      })(app),
      description: app.description || ''
    }
  },
  map: function (level, param) {
    var type = param.type;
         var limit = (function () {
            var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
        })();
        
        function filter(name,value){
            return Math.min(value,limit[name])
        }
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
          var list = null;
          if(!type||type=='hour'){
            list = DataCityHourly.findOne({},{sort: { TimePoint: -1 }});
            list = DataCityHourly.find({TimePoint:{$gt:(function(){
              var date = new Date(list.TimePoint);
              date.setUTCMinutes(date.getMinutes()-1);
              return date;
            })()}},{}).map(function(e){e.code=e.CityCode;return e;})
          }
          else if(type=='day'){
            list = DataCityDaily.findOne({}, { sort: { MONITORTIME: -1 } });
            list = DataCityDaily.find({MONITORTIME:{$gt:(function(){
              var date = new Date(list.MONITORTIME);
              date.setUTCMinutes(date.getMinutes()-1);
              return date;
            })()}},{}).map(function(e){e.code=Number(e.CITYCODE);return e;})
          }
          return Area.find({ code: { $mod: [100, 0], $not: { $mod: [1000, 0] } } }, { sort: { code: 1 } }).map(function (e) {
            var data = list.filter(function (ee) { return e.code == ee.code })
            if (!data || data.length == 0) return;
            data = data[0];
            var res = {
              code: e.code,
              name: e.name,
              longitude: e.longitude,
              latitude: e.latitude,
              aqi:filter('AQI', Number(data['AQI'])),
              PM25:filter('PM2.5', Number(data['PM2_5'])),
              PM10: filter('PM10',Number(data['PM10'])),
              O3: filter('O3',Number(data['O3'])),
              SO2: filter('SO2',Number(data['SO2'])),
              NO2: filter('NO2',Number(data['NO2'])),
              CO: filter('CO',Math.floor(Number(data['CO']) * 1000)),
            }
            if (!type);
            else if (type == 'hour') {
              res.timestamp = moment(data.TimePoint).format('YYYY-MM-DD HH:mm:ss');
              res.airQualityLevel = data['Quality'];
              res.primaryPollutant = data['PrimaryPollutant'];
              res.healthAdvice = healthAdvice(Number(data['AQI']));
            }
            else if (type == 'day') {
              res = {
                code: e.code,
                name: e.name,
                longitude: e.longitude,
                latitude: e.latitude,
                aqi: filter('AQI',Number(data['AQI'])),
                PM25: filter('PM2.5',Number(data['PM2_5'])),
                PM10: filter('PM10',Number(data['PM10'])),
                O3: filter('O3',Number(data['O3_1H'])),
                SO2: filter('SO2',Number(data['SO2'])),
                NO2: filter('NO2',Number(data['NO2'])),
                CO: filter('CO',Math.floor(Number(data['CO']) * 1000)),
              }
              res.timestamp = moment(data.MONITORTIME).format('YYYY-MM-DD');
              res.airQualityLevel = data['TYPENAME'];
              res.primaryPollutant = data['PRIMARYPOLLUTANT'];
              res.healthAdvice = data['DESCRIPTION'];
            }
            return res;
          })
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
          var list = null;
          if(!type||type=='hour'){
            list = DataStationHourly.findOne({},{sort: { monitorTime: -1 }});
            list = DataStationHourly.find({monitorTime:{$gt:(function(){
              var date = new Date(list.monitorTime);
              date.setUTCMinutes(date.getMinutes()-1);
              return date;
            })()}},{}).map(function(e){e.code=e.stationCode;return e;})
          }
          else if(type=='day'){
            list = DataStationDaily.findOne({}, { sort: { MONITORTIME: -1 } });
            list = DataStationDaily.find({MONITORTIME:{$gt:(function(){
              var date = new Date(list.MONITORTIME);
              date.setUTCMinutes(date.getMinutes()-1);
              return date;
            })()}},{}).map(function(e){e.code=Number(e.UNIQUECODE);return e;})
          }
          return Station.find({}, { sort: { UniqueCode: 1 } }).map(function (e) {
            var data = list.filter(function (ee) { return e.UniqueCode == ee.code })
            if (!data || data.length == 0)return;
            data = data[0];
            var res = {
              code: e.UniqueCode,
              name: e.PositionName,
              longitude: e.Longitude,
              latitude: e.Latitude,
              aqi: filter('AQI',data['AQI']),
              PM25:filter('PM2.5', data['105']),
              PM10: filter('PM10',data['104']),
              O3: filter('O3',data['102']),
              SO2: filter('SO2',data['100']),
              NO2: filter('NO2',data['101']),
              CO: filter('CO',Math.floor(Number(data['103']) * 1000)),
            }
            if (!type);
            else if (type == 'hour') {
              res.timestamp = moment(data.monitorTime).format('YYYY-MM-DD HH:mm:ss');
            }
            else if (type == 'day') {
              res = {
                code: e.UniqueCode,
                name: e.PositionName,
                longitude: e.Longitude,
                latitude: e.Latitude,
                aqi: filter('AQI',Number(data['AQI'])),
                PM25:filter('PM2.5', Number(data['PM2_5'])),
                PM10:filter('PM10', Number(data['PM10'])),
                O3: filter('O3',Number(data['O3'])),
                SO2: filter('SO2',Number(data['SO2'])),
                NO2: filter('NO2',Number(data['NO2'])),
                CO: filter('CO',Math.floor(Number(data['CO']) * 1000)),
              }
              res.timestamp = moment(data.MONITORTIME).format('YYYY-MM-DD');
            }
            return res;
          }).filter(function(e){return e;})
        }
      default:
        { return {err:'err param !'}}
    }
  },
  pollutantLimit: function () {
      var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
    var day = Number(day)
    if (isNaN(day) || [0, 30, 60, 90].indexOf(day) == -1) return { err: 'error param !' }
    
     var limit = (function () {
            var arr = Pollutant.find({ limit: { $exists: true } }, { sort: { pollutantCode: 1 } }).fetch();
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
        })();
        
        function filter(name,value){
            return Math.min(value,limit[name])
        }
        
    var area = Area.find({ code: { $not: { $mod: [1000, 0] } } }).fetch();
    var res = area.filter(function (e) { return e.code % 100 == 0 }).map(function (e) {
        var county = area.filter(function (ee) { return ee.code % e.code < 100 })[1];//主城区
        if (e.code == 152500) county = area.filter(function (ee) { return ee.code % e.code < 100 })[2];//锡林郭勒
      return {
        cityCode: e.code,
        cityName: e.name,
        countyCode: county.code,
        countyName: county.name
      }
    })
    var list = null;
    if(day==0){
      list = DataCityHourly.findOne({ }, { sort: { TimePoint: -1 } })
      list = DataCityHourly.find({TimePoint:{$gt:(function(){
        var date = new Date(list.TimePoint);
        date.setMinutes(date.getMinutes()-1);
        return date;
      })()}},{}).map(function(e){e.code=e.CityCode;return e;})
      return res.map(function(e){
        var data = list.filter(function(ee){return ee.code==e.cityCode;});
        if(!data||data.length==0)return;
        data = data[0];
        e.aqi = filter('AQI',Number(data['AQI']));
        e.PM25 =filter('PM2.5', Number(data['PM2_5']));
        e.PM10 =filter('PM10', Number(data['PM10']));
        e.O3 =filter('O3', Number(data['O3']));
        e.SO2 =filter('SO2', Number(data['SO2']));
        e.NO2 = filter('NO2',Number(data['NO2']));
        e.CO = filter('CO',Math.floor(Number(data['CO']) * 1000));
        return e;
      }).sort(function (a, b) {
        return a.aqi - b.aqi;
      })
    }
    else{
      list = DataCityDaily.findOne({ }, { sort: { MONITORTIME: -1 } })
      list = DataCityDaily.find({MONITORTIME:{$gt:(function(){
        var date = new Date(list.MONITORTIME);
        date.setDate(date.getDate()-day+1);
        date.setMinutes(date.getMinutes()-1)
        return date;
      })()}},{}).map(function(e){e.code=Number(e.CITYCODE);return e;})
      return res.map(function(e){
        var data = list.filter(function(ee){return ee.code==e.cityCode;});
        if(!data||data.length==0)return;
        // console.log(data.filter(function(e){return e.CITYCODE=='150100'}).map(function(e){return {CODE:e.CITYCODE,AQI:e.AQI}}).reverse().length)
        var sum = data.reduce(function (p, c, i, a) {
          var arr = ['AQI', 'PM2_5', 'PM10', 'O3_1H', 'SO2', 'NO2', 'CO']
          var res = {}
          arr.forEach(function (e) {
            res[e] = p[e] + c[e]
          })
          return res;
        })
        var avg = function (e) { return Math.round(e / Number(day)) }
        e.aqi = filter('AQI',avg(sum['AQI']));
        e.PM25 = filter('PM2.5',avg(sum['PM2_5']));
        e.PM10 =filter('PM10', avg(sum['PM10']));
        e.O3 =filter('O3', avg(sum['O3_1H']));
        e.SO2 = filter('SO2',avg(sum['SO2']));
        e.NO2 =filter('NO2', avg(sum['NO2']));
        e.CO =filter('CO', avg(sum['CO'] * 1000));
        return e;
      }).sort(function (a, b) {
        return a.aqi - b.aqi;
      })
    }
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
  },
  airForecast: function () {
    var data = DataAirForecast.findOne({}, { sort: { publishtime: -1 } })
    return {
      date: (function (s) {
        return s.slice(0, 4) + '年' + s.slice(4, 6) + '月' + s.slice(6, 8) + '日'
      })(data.publishtime),
      content: data.publishcontent
    }
  }
}
