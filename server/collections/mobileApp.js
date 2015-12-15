/**
 * Created by bai on 2015/9/6.
 */
MobileApp.attachSchema(new SimpleSchema({
    deviceType: {
        type: String
    },
    version: {
        type: String
    },
    app: {
        type: String,
        optional: true
    },
    logo: {
        type: String,
        optional: true
    },
    conf: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
}));


Meteor.publish('mobileApp', function () {
    return MobileApp.find();
});
Meteor.publish('file', function () {
    return FileFS.find();
});
//
//Meteor.methods({
//    appInsert: function (param) {
//        if (MobileApp.findOne({$and: [{'deviceType': param.deviceType}, {'version': param.version}]})) {
//        }
//        var app = {deviceType: param.deviceType, version: param.version}
//        if (param.file) {
//            if (param.file.app)
//                app.app = File.insert(new FS.File(param.file.app))
//            if (param.file.logo)
//                app.logo = File.insert(new FS.File(param.file.logo))
//            if (param.file.conf)
//                app.conf = File.insert(new FS.File(param.file.conf))
//        }
//        var appId = MobileApp.insert(app)
//    },
//    appUpdate: function (param) {
//        if (param.file.conf) {
//            var app = MobileApp.findOne({_id: param.id});
//            if (app.conf) {
//                File.remove({_id: app.conf})
//            }
//            var conf = File.insert(new FS.File(param.file.conf))
//            MobileApp.update({_id: param.id}, {$set: {conf: conf}})
//        }
//
//    },
//    appRemove: function (appId) {
//        var app = MobileApp.findOne({_id: appId})
//        if (app) {
//            if (app.app)File.remove({_id: app.app})
//            if (app.logo)File.remove({_id: app.logo})
//            if (app.conf)File.remove({_id: app.conf})
//        }
//        MobileApp.remove({_id: appId})
//    }
//})
MobileApp.allow({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function () {
        return true;
    }
})

FileFS.allow({
    insert: function () {
        return true;
    },
    download: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function () {
        return true;
    }
})


Meteor.methods({
    'downloadApp': function (deviceType) {
        var config = JSON.parse(Assets.getText("config.json"));
        var app = MobileApp.findOne({deviceType: deviceType}, {sort: {timestamp: -1}})
        var res = '';
        var id = '';
        if (deviceType == 'IOS') {
            res = 'itms-services://?action=download-manifest&url=' + app.conf
        } else {
            res = FileFS.findOne({_id: app.app}).url()
        }
        return res;
    }
})
