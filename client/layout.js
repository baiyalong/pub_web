/**
 * Created by bai on 2015/8/20.
 */

Template.layout.helpers({
    username: function () {
        var user = Meteor.user();
        if (user)
            return user.username;
    },
    authentication: function (role) {
        if (Roles.userIsInRole(Meteor.userId(), role))
            return true;
    },
    menu: function () {
        var city = Area.find({$and: [{code: {$mod: [100, 0]}}, {code: {$not: {$mod: [10000, 0]}}}]}, {sort: {code: 1}})
            .map(function (e) {
                return e.code.toString()
            })
        var arr = menu.filter(function (e) {
            if (e.role == 'publish')
                return !e.hide && Roles.userIsInRole(Meteor.userId(), city);
            else
                return !e.hide && Roles.userIsInRole(Meteor.userId(), e.role);
        });
        arr.forEach(function (e) {
            var path = window.location.pathname;
            if (e.path == '/'+path.split('/')[1])
                e.active = 'active'
            else
                e.active = null;
        });
        return arr;
    }
})
;

Template.layout.events({

    'click .logout': function (e) {
        Meteor.logout(function (err) {
            if (err)Util.modal('用户注销', err)
            else
                Router.go('/')
        })
    }
});

Template.layout.onRendered(function () {

    }
);

Template.layout.onCreated(function () {

    }
);