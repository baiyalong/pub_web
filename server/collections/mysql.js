


Meteor.publish('dataStationHourly', function (stationCode, date) {
    var dateFrom = new Date(Number(date));
    dateFrom.setHours(0);
    dateFrom.setMinutes(0);
    dateFrom.setSeconds(0);
    dateFrom.setSeconds(dateFrom.getSeconds() - 1);
    var dateTo = new Date(dateFrom);
    dateTo.setDate(dateTo.getDate() + 1);

    return DataStationHourly.find({
        stationCode: Number(stationCode),
        monitorTime: { $gte: dateFrom, $lt: dateTo }
    })
})

DataStationHourly.allow({
    'update': function () {
        return true;
    }
})


Meteor.publish('dataStationHourlyReSyncRecord', function () {
    return DataStationHourlyReSyncRecord.find()
})

DataStationHourlyReSyncRecord.allow({
    'remove': function () {
        return true;
    }
})