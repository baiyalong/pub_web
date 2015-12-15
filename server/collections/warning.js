/**
 * Created by bai on 2015/9/1.
 */


Warning.attachSchema(new SimpleSchema({
    content: {
        type: String
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    },
    cityCode: {
        type: Number
    },
    cityName: {
        type: String
    }
}));


Warning.allow({
    insert: function () {
        //TODO roles auth here
        return true;
    }, remove: function () {
        return true;
    }
})

Meteor.publish('warning', function () {
    //TODO page
    return Warning.find();
})


Meteor.publish('warningPassword', function () {
    return WarningPassword.find();
})

WarningPassword.allow({
    update: function () {
        //TODO roles auth here
        return true;
    }
})
