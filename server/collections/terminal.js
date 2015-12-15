/**
 * Created by bai on 2015/11/17.
 */

Terminal.attachSchema(new SimpleSchema({
    ID: {
        type: String
    },
    OS: {
        type: String
    },
    online: {
        type: Boolean, optional: true
    },
    uninstall: {
        type: Boolean, optional: true
    },
    positionCode: {
        type: Number, optional: true
    },
    longitude: {
        type: Number, decimal: true, optional: true
    },
    latitude: {
        type: Number, decimal: true, optional: true
    },
    subscription: {
        type: [Number], optional: true
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
}));


Terminal.allow({
    insert: function () {
        //TODO roles auth here
        return true;
    }, remove: function () {
        return true;
    },
    update: function () {
        return true;
    }
})

Meteor.publish('terminal', function () {
    //TODO page
    return Terminal.find();
})