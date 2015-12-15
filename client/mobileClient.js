/**
 * Created by bai on 2015/9/11.
 */


Template.mobileClient.helpers({
    err: function () {
        return Session.get('err')
    },
    title: function () {
        return Session.get('title')
    },
    clientVersion: function () {
        return Session.get('clientVersion')
    },
    appList: function () {
        return MobileApp.find({}, { sort: { 'timestamp': -1 } });
    },
    getPath: function (id) {
        if (id) {
            var url = FileFS.findOne({ _id: id }).url()
            url = url ? url.substring(0, url.indexOf('?')) : null;
            if (url) {
                url = window.location.origin + url;
            }
            return url;
        }
    },
    getTime: function (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    }
});

Template.mobileClient.events({
    'change input:file': function (event, template) {
        var id = event.target.id;
        FT[id] = event.target.files[0]
    },
    'click .add': function () {
        Session.set('err', null);
        Session.set('title', '新版本')
        $('#deviceType').val('IOS');
        $('#version').val('');
        $('#app').val('');
        $('#logo').val('');
        $('#conf').val('');
        $('#description').val('');
        FT = {};
        $('#deviceType').attr('disabled', false)
        $('#version').attr('disabled', false)
        $('#app').attr('disabled', false)
        $('#logo').attr('disabled', false)
        $('#conf').attr('disabled', false)
        $('#description').attr('disabled', false)
        $('#appModal').modal()
    },
    'click .cancel': function () {
        Session.set('err', null);
        $('#deviceType').val('IOS');
        $('#version').val('');
        $('#app').val('');
        $('#logo').val('');
        $('#conf').val('');
        $('#description').val('');
        FT = {};
    },
    'click .save': function () {
        Session.set('err', null);
        var deviceType = $('#deviceType').val();
        var version = $('#version').val().trim();
        var conf = $('#conf').val().trim();
        var description = $('#description').val().trim();
        if (version == '') {
            Session.set('err', '版本号不能为空！');
            return;
        }
        var id = FT.appId;
        if (!id) {
            //insert
            MobileApp.insert({
                deviceType: deviceType,
                version: version,
                conf: conf,
                description: description
            }, function (err, appId) {
                if (err) Util.modal('移动客户端管理', err)
                if (FT.app) {
                    FileFS.insert(FT.app, function (err, fileObj) {
                        MobileApp.update({ _id: appId }, { $set: { app: fileObj._id } })
                    })
                }
                if (FT.logo) {
                    FileFS.insert(FT.logo, function (err, fileObj) {
                        MobileApp.update({ _id: appId }, { $set: { logo: fileObj._id } })
                    })
                }
                //if (FT.conf) {
                //    FileFS.insert(FT.conf, function (err, fileObj) {
                //        MobileApp.update({_id: appId}, {$set: {conf: fileObj._id}})
                //    })
                //}
                if (err) console.log(err)
                $('#appModal').modal('hide')
            })
        }
        //Meteor.call('appInsert', {deviceType: deviceType, version: version}, function (err, res) {
        //    if (err)Util.modal('移动客户端管理', err);
        //    else {
        //        Util.modal('移动客户端管理', '添加成功！');
        //        $('#deviceType').val('IOS');
        //        $('#version').val('');
        //        $('#app').val('');
        //        $('#logo').val('');
        //        $('#conf').val('');
        //        FT = {};
        //        $('#deviceType').attr('disabled', false)
        //        $('#version').attr('disabled', false)
        //        $('#app').attr('disabled', false)
        //        $('#logo').attr('disabled', false)
        //        $('#conf').attr('disabled', false)
        //
        //
        //
        //    }
        //});
        else {
            //update
            //if (FT.conf) {
            //    var app = MobileApp.findOne({_id: id});
            //    if (app.conf) {
            //        FileFS.remove({_id: app.conf})
            //    }
            //    FileFS.insert(FT.conf, function (err, fileObj) {
            //        MobileApp.update({_id: id}, {$set: {conf: fileObj._id}})
            //    })
            //}
            MobileApp.update({ _id: id }, { $set: { conf: conf, description: description } }, function (err, res) {
                if (err) console.log(err)
                $('#appModal').modal('hide')
            })
        }
        //Meteor.call('appUpdate', {
        //    id: id, file: FT
        //}, function (err, res) {
        //    if (err)Util.modal('移动客户端管理', err);
        //    else {
        //        Util.modal('移动客户端管理', '更新成功！');
        //        $('#deviceType').val('IOS');
        //        $('#version').val('');
        //        $('#app').val('');
        //        $('#logo').val('');
        //        $('#conf').val('');
        //        FT = {};
        //        $('form').attr('id', undefined)
        //        $('#deviceType').attr('disabled', false)
        //        $('#version').attr('disabled', false)
        //        $('#app').attr('disabled', false)
        //        $('#logo').attr('disabled', false)
        //        $('#conf').attr('disabled', false)
        //    }
        //});
    },
    'click .edit': function () {
        Session.set('err', null);
        Session.set('title', '编辑')
        FT.appId = this._id;
        $('#deviceType').val(this.deviceType);
        $('#version').val(this.version);
        $('#conf').val(this.conf);
        $('#description').val(this.description);
        $('#deviceType').attr('disabled', true)
        $('#version').attr('disabled', true)
        $('#app').attr('disabled', true)
        $('#logo').attr('disabled', true)
        $('#conf').attr('disabled', false)
        $('#description').attr('disabled', false)
        $('#appModal').modal()
    },
    'click .detail': function () {
        Session.set('err', null);
        Session.set('title', '详情');
        Session.set('clientVersion', this)
        FT.appId = this._id;
        $('#appDetailModal').modal()
    },
    'click .remove': function () {
        //Meteor.call('appRemove', this._id, function () {
        //    Util.modal('移动客户端管理', '删除成功！');
        //})
        var app = MobileApp.findOne({ _id: this._id })
        if (app) {
            if (app.app) FileFS.remove({ _id: app.app })
            if (app.logo) FileFS.remove({ _id: app.logo })
            //if (app.conf)FileFS.remove({_id: app.conf})
        }
        MobileApp.remove({ _id: this._id })
    },
    'mouseenter tbody>tr': function () {
        $('#' + this._id).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function () {
        $('#' + this._id).css({
            'border': '1px dashed #D8D8D8',
        })
    }
})
;

Template.mobileClient.onRendered(function () {

}
    );

Template.mobileClient.onCreated(function () {

    FT = {}

}
    );