/**
 * Created by bai on 2015/9/1.
 */


Log.attachSchema(new SimpleSchema({
    userId: {
        type: String
    },
    username: {
        type: String
    },
    operation: {
        type: String
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
}));