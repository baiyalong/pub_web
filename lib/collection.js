/**
 * Created by bai on 2015/9/7.
 */

Area = new Mongo.Collection('area');
ForecastData = new Mongo.Collection('forecastData');
//MonitorData = new Mongo.Collection('monitorData');
Log = new Mongo.Collection('log');
Pollutant = new Mongo.Collection('pollutant');
Station = new Mongo.Collection('station');
Warning = new Mongo.Collection('warning');
WarningPassword = new Mongo.Collection('warningPassword');
AirQuality = new Mongo.Collection('airQuality');
DataAirQuality = new Mongo.Collection('dataAirQuality');

FileFS = new FS.Collection('file', {
    stores: [new FS.Store.GridFS('file', {
        beforeWrite: function (fileObj) {
            // We return an object, which will change the
            // filename extension and type for this store only.
            if (fileObj.original.name.indexOf('.apk') != -1)
                return {
                    extension: 'apk',
                    type: 'application/vnd.android.package-archive'
                };
        },
    })],
    filter: {
        maxSize: 1024 * 1024 * 1024, // in bytes
        //allow: {
        //    contentTypes: ['image/*', 'application/*'],
        //    extensions: ['png', 'apk', 'ipa']
        //},
        onInvalid: function (message) {
            if (Meteor.isClient) {
                alert(message);
            } else {
                console.log(message);
            }
        }
    }
})
MobileApp = new Mongo.Collection('mobileApp');

IPTrustList = new Mongo.Collection('IpTrustList');

Terminal = new Mongo.Collection('terminal');
Menu = new Mongo.Collection('menu');
WeiboConfig = new Mongo.Collection('weiboConfig');
WeiboRecord = new Mongo.Collection('weiboRecord');
//-------------mysql----------------------
// if (Meteor.isClient) {
// PollutantInfo = new Mongo.Collection('PollutantInfo')
//    MonitorStationInfo = new Mongo.Collection('MonitorStationInfo')

//    CityDailyRaw = new Mongo.Collection('CityDailyRaw')
//    CityDailyAudit = new Mongo.Collection('CityDailyAudit')

//  CityHourlyRaw = new Mongo.Collection('CityHourlyRaw')

// StationDailyRaw = new Mongo.Collection('StationDailyRaw')
//    StationDailyAudit = new Mongo.Collection('StationDailyAudit')

// StationHourlyRaw = new Mongo.Collection('StationHourlyRaw')
//    StationHourlyAudit = new Mongo.Collection('StationHourlyAudit')
// }
//---------------------------------------------
// StationHourlyCorrection = new Mongo.Collection('StationHourlyCorrection')

Weather = new Mongo.Collection('weather')

//-----------------------sync from mysql-------------------------------------

DataStationHourly = new Mongo.Collection('dataStationHourly');
DataStationHourlyReSyncRecord = new Mongo.Collection('dataStationHourlyReSyncRecord');

DataStationDaily = new Mongo.Collection('dataStationDaily');

DataCityHourly = new Mongo.Collection('dataCityHourly');

DataCityDaily = new Mongo.Collection('dataCityDaily');

DataAirForecast = new Mongo.Collection('dataAirForecast');
// ------------------------------------------------------------------------------

