/**
 * Created by bai on 2015/8/21.
 */

Template.login.helpers({});

Template.login.events({

    'click .login': function (e, t) {
        e.preventDefault()
        var username = t.$('#username').val()
        var password = t.$('#password').val()
        if (username == '')
            Util.modal('用户登录', '请输入用户名！')
        else if (password == '')
            Util.modal('用户登录', '请输入密码！')
        else
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
});

Template.login.onRendered(function () {

}
    );

Template.login.onCreated(function () {

}
    );