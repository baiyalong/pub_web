// /**
//  * Created by bai on 2015/11/27.
//  */
// /**
//  * Created by bai on 2015/9/1.
//  */


// StationHourlyCorrection.attachSchema(new SimpleSchema({
//     "100": {type: Number, decimal: true, optional: true},
//     "101": {type: Number, decimal: true, optional: true},
//     "102": {type: Number, decimal: true, optional: true},
//     "103": {type: Number, decimal: true, optional: true},
//     "104": {type: Number, decimal: true, optional: true},
//     "105": {type: Number, decimal: true, optional: true},
//     "106": {type: Number, decimal: true, optional: true},
//     "107": {type: Number, decimal: true, optional: true},
//     "108": {type: Number, decimal: true, optional: true},
//     "109": {type: Number, decimal: true, optional: true},
//     "110": {type: Number, decimal: true, optional: true},
//     "111": {type: Number, decimal: true, optional: true},
//     "112": {type: Number, decimal: true, optional: true},
//     "118": {type: Number, decimal: true, optional: true},
//     "AQI": {type: Number, decimal: true, optional: true},
//     //"pollutant": {type: String},
//     //"value": {type: Number, decimal: true,},
//     "monitorTime": {type: Date},
//     "stationCode": {type: Number},
//     "timestamp": {
//         type: Date,
//         autoValue: function () {
//             return new Date();
//         }
//     },

// }));

// StationHourlyCorrection.allow({
//     insert: function () {
//         return true;
//     },
//     update: function () {
//         return true;
//     },
//     remove: function () {
//         return true;
//     }
// })


// Meteor.publish('stationHourlyCorrection', function (station, date) {

//     if (station && date && !isNaN(Number(station) && !isNaN(Number(date)))) {

//         var s = Number(station);
//         var d1 = new Date(Number(date));
//         d1.setHours(0);
//         d1.setMinutes(0);
//         d1.setSeconds(0);
//         var d2 = new Date(d1);
//         d2.setDate(d2.getDate() + 1);

//         var res = StationHourlyCorrection.find({$and: [{stationCode: s}, {monitorTime: {$gte: d1}}, {monitorTime: {$lt: d2}}]}, {
//                 sort: {monitorTime: 1}
//             }
//         )

//         //console.log('stationHourlyCorrection', station, date, s, d1, d2, res)
//         return res;
//     }

// })

// Meteor.methods({
//     stationHourlyCorrectionUpdate: function (stationCode, monitorTime, pollutant, value) {

//         var update = {
//             stationCode: Number(stationCode),
//             monitorTime: monitorTime,
//         }
//         update[pollutant] = Number(value);
//         var t1 = new Date(monitorTime);
//         var t2 = new Date(t1);
//         t2.setMinutes(t2.getMinutes() + 1)
//         t1.setMinutes(t1.getMinutes() - 1)
//         var correction = StationHourlyCorrection.findOne({
//             $and: [{stationCode: Number(stationCode)}, {monitorTime: {$gt: t1}}, {monitorTime: {$lt: t2}}]
//         });

//         if (correction)
//             return StationHourlyCorrection.update(correction._id, {$set: update})
//         else
//             return StationHourlyCorrection.insert(update)
//     }
// })