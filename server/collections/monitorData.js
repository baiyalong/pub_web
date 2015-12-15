///**
// * Created by bai on 2015/9/1.
// */
//
//
//MonitorData.attachSchema(new SimpleSchema({
//    timestamp: {
//        type: Date
//    },
//    cityCode: {
//        type: Number
//    },
//    countyCode: {
//        type: Number,
//        optional: true
//    },
//    stationCode: {
//        type: Number
//    },
//    pollutant: {
//        type: [Object]
//    },
//    'pollutant.$.code': {
//        type: Number
//    },
//    'pollutant.$.value': {
//        type: Number,
//        decimal: true,
//        min: 0
//    },
//    AQI: {
//        type: Number,
//        optional: true
//    },
//    primaryPollutant: {
//        type: String,
//        optional: true
//    },
//
//
//    type: {
//        // hour or day
//        type: String
//    }
//}));
//
//MonitorData.allow({
//    insert: function () {
//        return true;
//    },
//    update: function () {
//        return true
//    }
//})
//
//Meteor.publish('monitorData', function (condition) {
//        condition = condition || {
//                date: new Date(),
//                stationCode: Station.findOne({}, {
//                    fields: {UniqueCode: 1},
//                    sort: {UniqueCode: 1}
//                }).UniqueCode
//            }
//        var d1 = new Date(condition.date);
//        d1.setHours(0);
//        d1.setMinutes(0);
//        d1.setSeconds(0);
//        var d2 = new Date(d1);
//        d2.setDate(d2.getDate() + 1);
//        return MonitorData.find({$and: [{stationCode: {$eq: condition.stationCode}}, {timestamp: {$gte: d1}}, {timestamp: {$lt: d2}}]}, {sort: {timestamp: 1}});
//    }
//)
//
//Meteor.methods({
//    dataCorrection: function (arr) {
//        //arr.forEach(function (e) {
//        //    MonitorData.update({
//        //        _id: e.id,
//        //        'pollutant.code': e.code
//        //    }, {$set: {'pollutant.$.value': e.value}})
//        //})
//    }
//})