/**
 * Created by bai on 2015/9/1.
 */


Station.attachSchema(new SimpleSchema({
    "StationId": {type: Number},
    "PositionName": {type: String},
    "Area": {type: String},
    "UniqueCode": {type: Number},
    "StationCode": {type: String},
    "StationPic": {type: Number},
    "Longitude": {type: Number, decimal: true},
    "Latitude": {type: Number, decimal: true},
    "Address": {type: Number},
    "PollutantCodes": {type: String},
    "StationTypeId": {type: Number},
    "Status": {type: Number},
    "BuildDate": {type: String},
    "Phone": {type: Number},
    "Manager": {type: Number},
    "Description": {type: String},
    "IsMonitor": {type: Number},
    "IsContrast": {type: Number},
    enableStatus: {
        type: Boolean, autoValue: function () {
            if (this.isInsert)
                return true;
        }
    },
    publishStatus: {
        type: Boolean, autoValue: function () {
            if (this.isInsert)
                return true;
        }
    },
    countyCode: {
        type: Number,
        optional: true
    },
    countyName: {
        type: String,
        optional: true
    }
}));

Station.allow({
    update: function () {
        return true;
    }
})

Meteor.publish('station', function (city) {
    if (city && !isNaN(Number(city)))
        return Station.find({$and: [{UniqueCode: {$gte: Number(city) * 1000}}, {UniqueCode: {$lt: (Number(city) + 1) * 1000}}]}, {
            sort: {UniqueCode: 1},
            fields: {
                UniqueCode: 1,
                PositionName: 1,
                Area: 1,
                enableStatus: 1,
                publishStatus: 1,
                countyCode: 1,
                countyName: 1
            }
        });
    return Station.find({}, {
        sort: {UniqueCode: 1},
        fields: {
            UniqueCode: 1,
            PositionName: 1,
            Area: 1,
            enableStatus: 1,
            publishStatus: 1,
            countyCode: 1,
            countyName: 1
        }
    });
});