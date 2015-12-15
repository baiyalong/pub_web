/**
 * Created by bai on 2015/11/17.
 */

Menu.attachSchema(new SimpleSchema({
    name: {
        type: String
    },
    path: {
        type: String
    },
    iconClass: {
        type: String, optional: true
    },
    imgSrc: {
        type: String, optional: true
    },
    roles: {
        type: [Object]
    },
    'roles.$': {
        type: String
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
}));


Menu.allow({
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

Meteor.publish('menu', function () {
    //TODO page
    return Menu.find();
})