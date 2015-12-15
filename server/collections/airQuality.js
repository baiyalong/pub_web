/**
 * Created by bai on 2015/10/13.
 */

AirQuality.attachSchema(new SimpleSchema({
    date: {
        type: Date
    },
    cityCode:{
        type:Number
    },
    cityName:{
        type:String
    },
    areaCode: {
        type: Number
    },
    areaName:{
        type:String
    },
    statusCode: {
        type: Number
    },
    statusName:{
        type:String
    },
    applyUserName: {
        type: String
    },
    applyTimestamp: {
        type: Date
    },
    applyContent: {
        type: Object
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
        type: Number
    },
    "applyContent.detail.$.airIndexLevel": {
        type: Number
    },
    "applyContent.detail.$.airQualityIndex": {
        type: Number
    },
    "applyContent.detail.$.visibility": {
        type: Number
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
        type: Number, optional: true
    },
    airIndexLevel: {
        type: Number, optional: true
    },
    airQualityIndex: {
        type: Number, optional: true
    },
    visibility: {
        type: Number, optional: true
    },
    description: {
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
Meteor.publish('airQuality', function () {
    return AirQuality.find();
})
Meteor.publish('dataAirQuality', function () {
    return DataAirQuality.find();
})

Meteor.methods({
    'applyAirQuality':function(data){
        AirQuality.upsert({ areaCode: data.areaCode, date: { $gte: (function(){
                var d = new Date(data.date);
                d.setSeconds(d.getSeconds()-1);
                return d;
            })(), $lte: (function(){
                var d = new Date(data.date);
                d.setSeconds(d.getSeconds()+1);
                return d;
            })() } }, { $set: data })
    },
    'auditAirQuality': function (id, update) {
        AirQuality.update({ _id: id }, { $set: update })
        if (update.statusCode == 1) {
            function ds(date){
                var d1 = new Date(date);
                d1.setSeconds(d1.getSeconds() - 1);
                var d2 = new Date(date);
                d2.setSeconds(d2.getSeconds() + 1);
                return { d1: d1, d2: d2 }
            }
            var audit = AirQuality.findOne({ _id: id })
            audit.applyContent.detail.forEach(function(e){
                var date = ds(e.date);
                DataAirQuality.upsert({ areaCode: audit.areaCode, date: { $gt: date.d1, $lt: date.d2 } },
                    { $set: { 
                        date: e.date, 
                        areaCode: audit.areaCode, 
                        primaryPollutant: e.primaryPollutant,
                        airIndexLevel:e.airIndexLevel,
                        airQualityIndex:e.airQualityIndex,
                        visibility:e.visibility
                        } })
            })
            
            var date = ds(audit.date)
            DataAirQuality.upsert({ areaCode: audit.areaCode, date: { $gt: date.d1, $lt: date.d2 } },
                { $set: { 
                    date: audit.date, 
                    areaCode: audit.areaCode, 
                    description: audit.applyContent.description 
                } })

        }
    }
})