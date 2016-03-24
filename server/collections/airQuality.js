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
Meteor.publish('airQuality', function (limit) {
    return AirQuality.find({},{sort:{date:-1},limit:limit});
})
Meteor.publish('dataAirQuality', function () {
    return DataAirQuality.find();
})

Meteor.methods({
    'removeAirQuality': function (id, real) {
        var areaCode = AirQuality.findOne({ _id: id }).areaCode;
        AirQuality.remove({ _id: id })
        if (real) {
            DataAirQuality.remove({ areaCode: areaCode, date: { $gt: new Date() } })
        }
        
    },
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

            DataAirQuality.remove({ areaCode: audit.areaCode, date: { $gt: new Date() } })

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