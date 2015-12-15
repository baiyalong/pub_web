/**
 * Created by bai on 2015/9/14.
 */
Template.ipNotTrust.helpers({
    clientIP: function () {
        return Session.get('clientIP')
    }
});

Template.ipNotTrust.events({});

Template.ipNotTrust.onRendered(function () {

    }
);

Template.ipNotTrust.onCreated(function () {
    Meteor.call('getClientIP', function (err, ip) {
        if (err)console.log(err)
        else Session.set('clientIP', ip)
    })
})
