/**
 * Created by bai on 2015/9/1.
 */


WeiboConfig.attachSchema(new SimpleSchema({
    weiboAccount: {
        type: String
    },
    weiboPassword: {
        type: String
    },
    autoPublish: {
        type: Boolean,
        optional: true
    },
    timerSchedule: {
        type: String,
        optional: true
    },
    waitData: {
        type: Boolean,
        optional: true
    },
    template: {
        type: String
    }
}));

WeiboRecord.attachSchema(new SimpleSchema({
    date: {
        type: Date,
        autoValue: function() {
            return new Date();
        }
    },
    content: {
        type: String
    },
    status: {
        type: Boolean
    }
}));


WeiboConfig.allow({
    insert: function() {
        //TODO roles auth here
        return true;
    }, update: function() {
        //TODO roles auth here
        return true;
    }
})

WeiboRecord.allow({
    insert: function() {
        //TODO roles auth here
        return true;
    }
})

Meteor.publish('weiboConfig', function() {
    return WeiboConfig.find();
})

Meteor.publish('weiboRecord', function() {
    return WeiboRecord.find();
})


