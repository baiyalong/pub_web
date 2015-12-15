/**
 * Created by bai on 2015/9/25.
 */

Template.app.helpers({
    //download: function (deviceType) {
    //    console.log('helper',deviceType)
    //    return Session.get(deviceType)
    //}
});

Template.app.events({});

Template.app.onRendered(function () {
        var deviceType = ['IOS', 'Android'];
        deviceType.forEach(function (e) {
            Meteor.call('downloadApp', e, function (err, res) {
                //console.log('callback',e)
                if (err)console.log(err);
                else {
                    //Session.set(e, res)
                    if (e == 'Android') {
                        res = window.location.origin + res.substring(res.indexOf('/cfs/'))
                    }
                    $('a.' + e).attr('href', res)
                }
            })
        })
    }
);

Template.app.onCreated(function () {

    }
);