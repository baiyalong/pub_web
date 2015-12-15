/**
 * Created by bai on 2015/11/26.
 */

weather = {
  appid: 'efb1b150432032da',
  private_key: '5fa7e3_SmartWeatherAPI_96bd783',
  key: function (public_key) {
    return encodeURIComponent(CryptoJS.HmacSHA1(public_key, weather.private_key).toString(CryptoJS.enc.Base64));
  },
  type: ['index_f', 'index_v', 'forecast_f', 'forecast_v'],
  getData: function (areaid, type, date) {
    var baseUrl = 'http://open.weather.com.cn/data/?areaid=' + areaid + '&type=' + type + '&date=' + moment(date).format('YYYYMMDDHHmm') + '&appid=';
    var key = weather.key(baseUrl + weather.appid);
    var url = baseUrl + weather.appid.substring(0, 6) + '&key=' + key;
    HTTP.call('GET', url, function (err, res) {
      if (err || res == null) {
        // console.log(url, err)
        weather.getData(areaid, type, date);
      }
      else if (res.content != 'data error') {
        var res = Weather.upsert({
          areaid: areaid
        }, {
            $set: {
              areaid: areaid,
              type: type,
              date: date,
              content: JSON.parse(res.content)
            }
          })
        console.log(url, res);
      }
    })
  },
  job: function () {
    weather.areaid.forEach(function (e) {
      weather.getData(e, weather.type[3], new Date());
    })
  },
  areaid: [101080101, 101080102, 101080103, 101080104, 101080105, 101080106, 101080107, 101080201, 101080202, 101080203, 101080204, 101080205, 101080206, 101080207, 101080301, 101080401, 101080402, 101080403, 101080404, 101080406, 101080407, 101080408, 101080409, 101080410, 101080411, 101080412, 101080501, 101080502, 101080503, 101080504, 101080505, 101080506, 101080507, 101080508, 101080509, 101080510, 101080511, 101080601, 101080603, 101080604, 101080605, 101080606, 101080607, 101080608, 101080609, 101080610, 101080611, 101080612, 101080613, 101080614, 101080615, 101080701, 101080703, 101080704, 101080705, 101080706, 101080707, 101080708, 101080709, 101080710, 101080711, 101080712, 101080713, 101080801, 101080802, 101080803, 101080804, 101080805, 101080806, 101080807, 101080808, 101080809, 101080810, 101080901, 101080903, 101080904, 101080906, 101080907, 101080908, 101080909, 101080910, 101080911, 101080912, 101080913, 101080914, 101080915, 101080916, 101080917, 101081001, 101081002, 101081003, 101081004, 101081005, 101081006, 101081007, 101081008, 101081009, 101081010, 101081011, 101081012, 101081014, 101081015, 101081016, 101081101, 101081102, 101081103, 101081104, 101081105, 101081106, 101081107, 101081108, 101081109, 101081201, 101081202, 101081203, 101081204, 101081205, 101081206, 101081207, 101081208, 101081209, 101081210, 101081211, 101081212]
}
