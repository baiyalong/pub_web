/**
 * Created by bai on 2015/9/25.
 */

Template.app.helpers({
    //download: function (deviceType) {
    //    console.log('helper',deviceType)
    //    return Session.get(deviceType)
    //}
});

Template.app.events({
    'click #IOS': function (e, t) {
        e.preventDefault();
//        alert('IOS版本正在提交苹果审核 请您耐心等待')
	window.open("https://itunes.apple.com/us/app/nei-meng-gu-kong-qi-zhi-liang/id1069761161?mt=8")  
  }
});

Template.app.onRendered(function () {
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
    if (!isWeiXin()) {
        $('#modal-overlay').css('display', 'none')
    }


    var deviceType = ['IOS', 'Android'];
    deviceType.forEach(function (e) {
        Meteor.call('downloadApp', e, function (err, res) {
            //console.log('callback',e)
            if (err) console.log(err);
            else {
                //Session.set(e, res)
                // if (e == 'Android') {
                //     res = window.location.origin + res.substring(res.indexOf('/cfs/'))
                // }
                $('a.' + e).attr('href', res)
            }
        })
    })
}
    );

Template.app.onCreated(function () {


}
    );
