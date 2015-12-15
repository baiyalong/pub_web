/**
 * Created by bai on 2015/8/21.
 */

Template.login.helpers({});

Template.login.events({

    'click .login': function (e) {
        e.preventDefault()
        var username = $('#username').val()
        var password = $('#password').val()
        Meteor.loginWithPassword(username, password, function (err) {
            if (err)Util.modal('用户登录', err)
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