/////**
//// * Created by bai on 2015/8/20.
//// */
//////��ʱ����
////
////
scheduleJobs.airQualityInit = {
  schedule: function (parser) {
    //return parser.text('at 2:00 am');
    return parser.text('at 2:00 am');
  },
  job: function () {
    console.log('initAirQuality start at :', new Date())
    Meteor.call('initAirQuality', function (err, res) {
      console.log('initAirQuality end at :', new Date(), err, res)
    });
  }
}

scheduleJobs.weather = {
  schedule: function (parser) {
    //return parser.text('at 2:00 am');
    return parser.text('every 1 h');
  },
  job: function () {
    weather.job();
  }
}

scheduleJobs.syncDataStationHourly = {
  schedule: function (parser) {
    return parser.text('every 5 m');
  },
  job: function () {
    mysql.syncDataStationHourly();
  }
}

scheduleJobs.syncDataStationDaily = {
  schedule: function (parser) {
    return parser.text('every 5 m');
  },
  job: function () {
    mysql.syncDataStationDaily();
  }
}


scheduleJobs.syncDataCityHourly = {
  schedule: function (parser) {
    return parser.text('every 5 m');
  },
  job: function () {
    mysql.syncDataCityHourly();
  }
}


scheduleJobs.syncDataCityDaily = {
  schedule: function (parser) {
    return parser.text('every 5 m');
  },
  job: function () {
    mysql.syncDataCityDaily();
  }
}

scheduleJobs.syncDataAirForecast = {
  schedule: function (parser) {
    return parser.text('every 5 m');
  },
  job: function () {
    // mysql.syncDataAirForecast();
  }
}

