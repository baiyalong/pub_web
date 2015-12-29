/**
 * Created by bai on 2015/8/21.
 */

Template.login.helpers({
    // verifyCodeURL: function () {
    //     return Session.get('verifyCodeURL')
    // }
});

Template.login.events({
    'click #img': function (e, t) {
        t.$("#img").attr("src", Session.get('verifyCodeURL') + '?rand=' + Math.random());
    },
    'click button.login': function (e, t) {
        e.preventDefault()
        var username = t.$('#username').val()
        var password = t.$('#password').val()
        var verifyCode = t.$('#verifyCode').val()
        // if (verifyCode == '')
        //     Util.modal('用户登录', '请输入验证码！')
        // else 
        if (username == '')
            Util.modal('用户登录', '请输入用户名！')
        else if (password == '')
            Util.modal('用户登录', '请输入密码！')
        else {
            Meteor.call('checkVerifyCode', Meteor.connection._lastSessionId, verifyCode, function (err, res) {
                res = true;
                if (err) Util.modal('用户登录', '验证码校验失败！')
                else if (!res) {
                    Util.modal('用户登录', '验证码错误！');
                    t.$("#img").attr("src", Session.get('verifyCodeURL') + '?rand=' + Math.random());
                }
                else if (res) {
                    Meteor.loginWithPassword(username, password, function (err) {
                        if (err) {
                            if (err.reason == "User not found") Util.modal('用户登录', '用户名不存在！')
                            else if (err.reason == "Incorrect password") Util.modal('用户登录', '密码错误！')
                            else Util.modal('用户登录', err)
                        }
                        else
                            Router.go('/')
                    })
                }
            })
        }
    }
});

Template.login.onRendered(function () {
    $("#img").attr("src", Session.get('verifyCodeURL') + '?rand=' + Math.random());
}
    );

Template.login.onCreated(function () {
    Session.set('verifyCodeURL', "/api/verifyCode/" + Meteor.connection._lastSessionId)
}
    );