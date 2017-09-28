/**
 * Created by bai on 2015/9/1.
 */


Station.attachSchema(new SimpleSchema({
    "StationId": { type: Number },
    "PositionName": { type: String },
    "Area": { type: String },
    "UniqueCode": { type: Number },
    "StationCode": { type: String },
    "StationPic": { type: Number, optional: true },
    "Longitude": { type: Number, decimal: true },
    "Latitude": { type: Number, decimal: true },
    "Address": { type: Number, optional: true },
    "PollutantCodes": { type: String, optional: true },
    "StationTypeId": { type: Number, optional: true },
    "Status": { type: Number, optional: true },
    "BuildDate": { type: String, optional: true },
    "Phone": { type: Number, optional: true },
    "Manager": { type: Number, optional: true },
    "Description": { type: String, optional: true },
    "IsMonitor": { type: Number, optional: true },
    "IsContrast": { type: Number, optional: true },
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
        return Station.find({ $and: [{ countyCode: { $gte: +city } }, { countyCode: { $lt: +city + 100 } }] }, {
            sort: { UniqueCode: 1 },
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
        sort: { UniqueCode: 1 },
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