/**
 * Created by bai on 2015/10/13.
 */

AirQuality.attachSchema(new SimpleSchema({
    date: {
        type: Date
    },
    cityCode: {
        type: Number
    },
    cityName: {
        type: String
    },
    areaCode: {
        type: Number,
        optional: true
    },
    areaName: {
        type: String,
        optional: true
    },
    statusCode: {
        type: Number
    },
    statusName: {
        type: String
    },
    applyUserName: {
        type: String,
        optional: true
    },
    applyTimestamp: {
        type: Date,
        optional: true
    },
    applyContent: {
        type: Object,
        optional: true
    },
    "applyContent.detail": {
        type: [Object]
    },
    "applyContent.detail.$": {
        type: Object
    },
    "applyContent.detail.$.date": {
        type: Date
    },
    "applyContent.detail.$.primaryPollutant": {
        type: String
    },
    "applyContent.detail.$.airIndexLevel": {
        type: String
    },
    "applyContent.detail.$.airQualityIndex": {
        type: String,
        optional: true
    },
    "applyContent.detail.$.visibility": {
        type: String,
        optional: true
    },
    "applyContent.description": {
        type: String,
        optional: true
    },
    auditUserName: {
        type: String,
        optional: true
    },
    auditTimestamp: {
        type: Date,
        optional: true
    },
    auditOption: {
        type: String,
        optional: true
    }
}));
DataAirQuality.attachSchema(new SimpleSchema({
    date: {
        type: Date
    },
    areaCode: {
        type: Number
    },
    primaryPollutant: {
        type: String, optional: true
    },
    airIndexLevel: {
        type: String, optional: true
    },
    airQualityIndex: {
        type: String, optional: true
    },
    visibility: {
        type: String, optional: true
    },
    description: {
        type: String, optional: true
    }
}))
DataAirForecast.attachSchema(new SimpleSchema({
    publishtime: {
        type: String
    },
    publishcontent: {
        type: String, optional: true
    }
}))
AirQuality.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true;
    }
}
)
DataAirQuality.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true;
    }
})
DataAirForecast.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true;
    }
})
Meteor.publish('airQuality', function (page, count, filter) {
    if (!filter) filter = {}
    return AirQuality.find(filter, { sort: { date: -1 }, skip: (page - 1) * count, limit: count });
})
Meteor.publish('dataAirQuality', function () {
    return DataAirQuality.find();
})
Meteor.publish('dataAirForecast', function (page, count, filter) {
    if (!filter) filter = {}
    return DataAirForecast.find(filter, { sort: { publishtime: -1 }, skip: (page - 1) * count, limit: count });
})

Meteor.methods({
    'dataAirForecast_upsert': function (data) {
        var date = new Date();
        var publishtime = moment(date).format('YYYYMMDD00');
        DataAirForecast.upsert({ publishtime: publishtime }, {
            $set:
            {
                publishtime: publishtime,
                publishcontent: data.publishcontent
            }
        });
    },
    'airQuality_pages': function (count, filter) {
        if (!filter) filter = {}
        return Math.round(AirQuality.find(filter).count() / count)
    },
    'dataAirForecast_pages': function (count, filter) {
        if (!filter) filter = {}
        return Math.round(DataAirForecast.find(filter).count() / count)
    },
    'removeAirQuality': function (id, statusCode) {
        var cityCode = AirQuality.findOne({ _id: id }).cityCode;
        // AirQuality.remove({ _id: id })
        AirQuality.update(id, {
            $set: {
                statusCode: -2,
                statusName: '未提交',
                applyContent: null,
            }
        })
        if (statusCode == 2) {
            DataAirQuality.remove({
                cityCode: cityCode, date: {
                    $gt: (function () {
                        var d = new Date();
                        d.setHours(1);
                        d.setMinutes(0);
                        d.setSeconds(0);
                        return d;
                    })()
                }
            })
        }

    },
    'applyAirQuality': function (data) {
        AirQuality.update({
            cityCode: data.cityCode, date: {
                $gte: (function () {
                    var d = new Date();
                    d.setHours(1);
                    d.setMinutes(0);
                    d.setSeconds(0);
                    return d;
                })()
            }
         }, { $set: Object.assign(data,{date:new Date()}) },{upsert:true})
    },
    'auditAirQuality': function (id, update) {
        AirQuality.update({ _id: id }, { $set: update })
        // if (update.statusCode == 1) {
        //     function ds(date){
        //         var d1 = new Date(date);
        //         d1.setSeconds(d1.getSeconds() - 1);
        //         var d2 = new Date(date);
        //         d2.setSeconds(d2.getSeconds() + 1);
        //         return { d1: d1, d2: d2 }
        //     }
        //     var audit = AirQuality.findOne({ _id: id })

        //     DataAirQuality.remove({ areaCode: audit.areaCode, date: { $gt: new Date() } })

        //     audit.applyContent.detail.forEach(function(e){
        //         var date = ds(e.date);
        //         DataAirQuality.upsert({ areaCode: audit.areaCode, date: { $gt: date.d1, $lt: date.d2 } },
        //             { $set: { 
        //                 date: e.date, 
        //                 areaCode: audit.areaCode, 
        //                 primaryPollutant: e.primaryPollutant,
        //                 airIndexLevel:e.airIndexLevel,
        //                 airQualityIndex:e.airQualityIndex,
        //                 visibility:e.visibility
        //                 } })
        //     })

        //     var date = ds(audit.date)
        //     DataAirQuality.upsert({ areaCode: audit.areaCode, date: { $gt: date.d1, $lt: date.d2 } },
        //         { $set: { 
        //             date: audit.date, 
        //             areaCode: audit.areaCode, 
        //             description: audit.applyContent.description 
        //         } })
        // 
        // }
    },
    'publishAirQuality': function () {
        //点击发布按钮，DataAirQuality清空，通过审核的AirQuality更新到DataAirQuality
        //前台接口部分展示DataAirQuality所有数据

        DataAirQuality.remove({});
        AirQuality.find({
            statusCode: { $gte: 1 }, date: {
                $gt: (function () {
                    var d = new Date();
                    d.setDate(d.getDate() - 1);
                    return d;
                })()
            }
        }).forEach(function (audit) {

            AirQuality.update({ _id: audit._id }, {
                $set: {
                    statusCode: 2,
                    statusName: '已发布'
                }
            })

            audit.applyContent.detail.forEach(function (e) {
                DataAirQuality.insert({
                    date: e.date,
                    areaCode: audit.areaCode,
                    primaryPollutant: e.primaryPollutant,
                    airIndexLevel: e.airIndexLevel,
                    airQualityIndex: e.airQualityIndex,
                    visibility: e.visibility
                })
            })
            DataAirQuality.insert({
                date: audit.date,
                areaCode: audit.areaCode,
                description: audit.applyContent.description || ''
            })
        })
    },
    'initAirQuality': function () {
        var date = new Date();
        var city = Area.find({
            $and: [{
                code: {
                    $mod: [100, 0]
                }
            }, {
                code: {
                    $not: {
                        $mod: [10000, 0]
                    }
                }
            }]
        }, { sort: { code: 1 }, fields: { code: 1, name: 1 } }).fetch()

        var init = city.map(function (e) {
            return {
                date: date,
                cityCode: e.code,
                cityName: e.name,
                statusCode: -2,
                statusName: '未提交'
            }
        })

        init.forEach(function (e) {
            AirQuality.insert(e)
        })
    }
})
