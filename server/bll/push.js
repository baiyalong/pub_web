/**
 * Created by bai on 2015/11/17.
 */


Meteor.methods({
    push: function () {
        var warning = Warning.findOne({}, {sort: {timestamp: -1}});
        if (!warning)
            return;
        var ts = Terminal.find({$and: [{online: {$not: {$eq: false}}}, {uninstall: {$not: {$eq: true}}}]}).fetch();

        function filter(OS) {
            return ts.filter(function (e) {
                if (e.subscription && e.subscription.length != 0 && e.OS == OS) {
                    var subscript = false;
                    e.subscription.forEach(function (s) {
                        if (Math.floor(s / 100) * 100 == warning.cityCode)subscript = true;
                    })
                    return subscript;
                }
            });
        }

        Push2IOS.send(filter('IOS'), warning.content);
        Push2Android.send(filter('Android'), warning.content);
    }
});

