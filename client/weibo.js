Template.weibo.helpers({
    autoPublish: function () {
        var config = WeiboConfig.findOne()
        return config.autoPublish ? { color: 'green', text: '自动发布已启用' } : { color: 'red', text: '自动发布未启用' }
    },
    varList: function () {
        return Session.get('weiboVarList')
    },
    weiboConfig: function () {
        return WeiboConfig.findOne()
    },
    recordList: function () {
        return WeiboRecord.find({}, { $sort: { date: -1 } })
    },
    auth_status: function () {
        var config = WeiboConfig.findOne()
        return config.token ? { color: 'green', text: '已授权' } : { color: 'red', text: '未授权' }
        //+ '&nbsp&nbsp' + moment(config.auth_time).format('YYYY-MM-DD HH:mm:ss') + '&nbsp&nbsp' + config.expires_in / 3600 + '小时' + '有效期'
    },
    date_helper: function (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    status_helper: function (status) {
        return status ? '成功' : '失败'
    },
    wordCount: function () {
        return Session.get('wordCount')
    }
})

Template.weibo.events({
    'keypress #template': function (e, t) {
        var content = t.$('#template').val().trim();
        if (content) {
            var varList = Session.get('weiboVarList');
            varList.forEach(function (e) {
                content = content.replace(e.name, e.value)
            })
            Session.set('wordCount', content.length)
        }
        else Session.set('wordCount', 0)
    },
    'click .authorize': function (e, t) {
        e.preventDefault();
        Meteor.call('weibo_getAppInfo', function (err, res) {
            if (err) Util.modal('微博授权', err)
            else
                window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id={{client_id}}&redirect_uri={{redirect_uri}}'
                    .replace('{{client_id}}', res._weibo_app_key)
                    .replace('{{redirect_uri}}', res._weibo_app_redirect_url)
        })

    },
    'click .revokeAuth': function (e, r) {
        e.preventDefault();
        Meteor.call('weibo_revokeAuth', function (err, res) {
            Util.modal('微博解除授权', err || '解除授权成功！')
        })
    },
    'click .preview': function (e, t) {
        e.preventDefault();
        Meteor.call('weibo_analyzeContent', t.$('#template').val().trim(), function (err, res) {
            Util.modal('微博发布预览', err || res)
        })
    },
    'click .publish': function (e, t) {
        e.preventDefault();
        Meteor.call('weibo_publish', t.$('#template').val().trim(), function (err, res) {
            Util.modal('微博发布', err || '微博发布成功！')
            WeiboRecord.insert(err ? { status: false, error: JSON.stringify(err) } : { status: true })
        })
    },
    'click .saveConfig': function (e, t) {
        e.preventDefault();
        //get config
        var config = {
            autoPublish: t.$('#autoPublish').is(':checked'),
            timerSchedule: t.$('#timerSchedule').val().trim(),
            waitData: t.$('#waitData').is(':checked'),
            template: t.$('#template').val().trim()
        }
        //verify
        var err = null;
        // if (config.timerSchedule == '') err = '自动发布时间不能为空！'
        if (config.template == '') err = '发布信息不能为空！'
        if (!/^(0?\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/.test(config.timerSchedule)) err = '时间格式不正确！'
        if (err) {
            Util.modal('微博发布配置', err);
            return;
        }
        //check authorize
        var weibo_config = WeiboConfig.findOne();
        if (weibo_config && !weibo_config.token)
            Util.modal('微博发布配置', '微博帐号未授权！')
        else
            //update config
            WeiboConfig.update(weibo_config._id, { $set: config }, function (err, res) {
                Util.modal('微博发布配置', err || '保存成功！')
                if (!err) {
                    //autoPublish
                    Meteor.call(config.autoPublish ? 'weiboCronReset' : 'weiboCronStop')
                }
            })
    },
    'click .remove': function (e, t) {
        WeiboRecord.remove(this._id)
    },
    'mouseenter tbody>tr': function () {
        var id = this.code || this._id;
        $('#' + id).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function () {
        var id = this.code || this._id;
        $('#' + id).css({
            'border': '1px dashed #D8D8D8',
        })
    }
})

Template.weibo.onRendered(function () {
    var content = $('#template').val().trim();
    if (content) {
        Meteor.call('weibo_analyzeContent', content, function (err, res) {
            Session.set('wordCount', res.length)
        })
        // var varList = Session.get('weiboVarList');
        // varList.forEach(function (e) {
        //     content = content.replace(e.name, e.value)
        // })
        // Session.set('wordCount', content.length)
    }
    else Session.set('wordCount', 0)

    var weibo_config = WeiboConfig.findOne();
    var code = window.location.search.split('=');
    if (code && code.length == 2 && code[0] == '?code') {
        code = code[1];
        if (code != weibo_config.code)
            Meteor.call('weibo_accessToken', code, function (err, res) {
                Util.modal('微博授权', err || '授权成功！')
            })
    }
    // else if (weibo_config.token) {
    //     Meteor.call('weibo_getTokenInfo', function (err, res) {
    //         if (err)
    //             WeiboConfig.update(weibo_config._id, {
    //                 $set: {
    //                     token: ''
    //                 }
    //             })
    //     })
    // }

}
);

Template.weibo.onCreated(function () {
    Meteor.call('weiboVarList', function (err, res) {
        if (err) console.log(err)
        else Session.set('weiboVarList', res)
    })

    Session.set('pages_method', 'weiboRecord_pages')
    Session.set('collection', 'weiboRecord')
    Session.set('filter', {})
}
);