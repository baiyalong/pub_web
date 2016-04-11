


Meteor.publish('dataStationHourly', function(stationCode, date) {
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
    'update': function() {
        return true;
    }
})


Meteor.publish('dataStationHourlyReSyncRecord', function(page, count) {
    return DataStationHourlyReSyncRecord.find({}, { sort: { tStart: -1 }, skip: (page - 1) * count, limit: count })
})

DataStationHourlyReSyncRecord.allow({
    'remove': function() {
        return true;
    }
})

Meteor.methods({
    dataStationHourlyReSyncRecord_pages: function (count) {
        return Math.round(DataStationHourlyReSyncRecord.find().count()/count)

    }
})

