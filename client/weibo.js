Template.weibo.helpers({
    autoPublish: function() {
        var config = WeiboConfig.findOne()
        return config.autoPublish ? { color: 'green', text: '自动发布已启用' } : { color: 'red', text: '自动发布未启用' }
    },
    varList: function() {
        return Session.get('weiboVarList')
    },
    weiboConfig: function() {
        return WeiboConfig.findOne()
    },
    recordList: function() {
        return WeiboRecord.find()
    },

})

Template.weibo.events({
    'click .save': function(e, t) {
        //get config
        var config = {
            weiboAccount: t.$('#weiboAccount').val(),
            weiboPassword: t.$('#weiboPassword').val(),
            autoPublish: t.$('#autoPublish').is(':checked'),
            timerSchedule: t.$('#timerSchedule').val().trim(),
            waitData: t.$('#waitData').is(':checked'),
            template: t.$('#template').val().trim()
        }
        //verify
        var err = null;
        if (config.weiboAccount == '') err = '帐号不能为空！'
        if (config.weiboPassword == '') err = '密码不能为空！'
        if (config.template == '') err = '发布信息不能为空！'
        if (err) {
            Util.modal('微博发布配置', err);
            return;
        }
        //update config
        WeiboConfig.update({ _id: WeiboConfig.findOne()._id }, { $set: config }, function(err, res) {
            var val = '保存成功！'
            if (err) val = err;
            Util.modal('微博发布配置', val)
        })
    },
    'click .detail': function(e, t) {
        //modal
        t.$('#weiboModal').modal()
    },
    'mouseenter tbody>tr': function() {
        $('#' + this.code).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function() {
        $('#' + this.code).css({
            'border': '1px dashed #D8D8D8',
        })
    }
})

Template.weibo.onRendered(function() {

}
);

Template.weibo.onCreated(function() {
    Meteor.call('weiboVarList', function(err, res) {
        if (err) console.log(err)
        else Session.set('weiboVarList', res)
    })

    Session.set('pages_method', 'weiboRecord_pages')
    Session.set('collection', 'weiboRecord')
    Session.set('filter', {})
}
);