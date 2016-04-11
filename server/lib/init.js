///**
// * Created by bai on 2015/9/6.
// */
Meteor.startup(function() {
    if (WeiboConfig.find().count() == 0)
        WeiboConfig.insert({
            weiboAccount:'weiboAccount',
            weiboPassword:'weiboPassword',
            autoPublish:false,
            timerSchedule:'0:00',
            waitData:false,
            template:'template'
        })
    //
    //    //admin user
    //    if (Meteor.users.find().count() == 0) {
    //        var uid = Accounts.createUser({username: 'admin', password: '123'});
    //        Roles.addUsersToRoles(uid, 'admin')
    //
    //        uid = Accounts.createUser({username: 'admin1', password: '123'})
    //        Roles.addUsersToRoles(uid, 'subAdmin')
    //        uid = Accounts.createUser({username: 'admin2', password: '123'})
    //        Roles.addUsersToRoles(uid, 'subAdmin')
    //
    //    }
    //
    //Area data
    //    if (Area.find().count() == 0) {
    //        var data = JSON.parse(Assets.getText("area.json"));
    //        data.forEach(function (e) {
    //            Area.insert(e)
    //        });
    //    }
    //
    //    //Pollutant data
    //    if (Pollutant.find().count() == 0) {
    //        var data = JSON.parse(Assets.getText("pollutant.json"));
    //        data.forEach(function (e) {
    //            Pollutant.insert(e)
    //        });
    //    }
    //
    //    //monitor station data
    //    if (Station.find().count() == 0) {
    //        var data = JSON.parse(Assets.getText("station.json"));
    //        data.forEach(function (e) {
    //            Station.insert(e)
    //        });
    //    }
    //
    //
    //    //TODO config
    //
    //
    //    //fake  monitor data
    //    if (false) {
    //        //monitorDate
    //        Station.find({}, {
    //            fields: {UniqueCode: 1, PositionName: 1, Area: 1},
    //            sort: {UniqueCode: 1}
    //        }).forEach(function (e) {
    //            var t = new Date('2015-09-01 00:00:00');
    //            while (t < new Date()) {
    //                var record = MonitorData.findOne({$and: [{timestamp: {$eq: t}}, {stationCode: {$eq: e.UniqueCode}}]});
    //                if (record == null) {
    //                    MonitorData.insert({
    //                        timestamp: t,
    //                        cityCode: Math.floor(e.UniqueCode / 1000),
    //                        stationCode: e.UniqueCode,
    //                        pollutant: (function (arr) {
    //                            return arr.map(function (e) {
    //                                return {code: e, value: Math.floor(Math.random() * 1000)}
    //                            })
    //                        })([100, 101, 102, 103, 104, 105]),
    //                        type: 'hour'
    //                    })
    //                }
    //                t.setHours(t.getHours() + 1)
    //            }
    //        })
    //    }
})
//

