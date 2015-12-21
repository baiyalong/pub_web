/**
 * Created by bai on 2015/9/6.
 */


Pollutant.attachSchema(new SimpleSchema({
    pollutantCode: {
        type: Number
    },
    pollutantName: {
        type: String
    },
    chineseName: {
        type: String
    },
    unit: {
        type: String
    },
    limit: {
        type: Number,
        optional: true
    }
}));

Pollutant.allow({
    update: function () {
        //TODO roles auth here
        return true;
    }
})

Meteor.publish('limit', function () {
    return Pollutant.find({ pollutantCode: { $in: [90, 100, 101, 102, 103, 104, 105] } }, {
        fields: {
            pollutantCode: 1,
            pollutantName: 1,
            limit: 1
        },
        sort: {
            pollutantCode: 1
        }
    })
})

Meteor.methods({
    limitUpdate: function (id, value) {
        if (id && value && !isNaN(Number(value)))
            Pollutant.update({ _id: id }, { $set: { limit: Number(value) } })
    },
    
})