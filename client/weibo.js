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
        return WeiboRecord.find()
    },

})

Template.weibo.events({
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
            Util.modal('微博解除授权', '解除授权成功！')
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
            WeiboConfig.update({ _id: WeiboConfig.findOne()._id }, { $set: config }, function (err, res) {
                Util.modal('微博发布配置', err || '保存成功！')
            })


    },
    'click .detail': function (e, t) {
        //modal
        t.$('#weiboModal').modal()
    },
    'mouseenter tbody>tr': function () {
        $('#' + this.code).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function () {
        $('#' + this.code).css({
            'border': '1px dashed #D8D8D8',
        })
    }
})

Template.weibo.onRendered(function () {
    var code = window.location.search.split('=');
    if (code && code.length == 2 && code[0] == '?code') {
        code = code[1];
        Meteor.call('weibo_accessToken', code, function (err, res) {
            if (err) Util.modal('微博授权', err)
        })
    }
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