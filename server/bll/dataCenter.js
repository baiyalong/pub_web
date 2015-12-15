/**
 * Created by bai on 2015/9/7.
 */

Meteor.methods({
    dataStationHourlyReSync: function (dateFrom, dateTo) {
        for (var date = dateFrom; date <= dateTo; date.setDate(date.getDate() + 1)) {
            console.log(date)
            var record = {
                date: date,
                success: true,
                tStart: new Date()
            }
            try {
                mysql.DataSationHourlyReSync(date);
            }
            catch (e) {
                record.success = false;
            }
            finally {
                record.tEnd = new Date();
                DataStationHourlyReSyncRecord.insert(record);
            }
        }
    }
})

