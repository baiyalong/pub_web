/**
 * Created by bai on 2015/9/7.
 */

Template.airForecast.helpers({
    title: function () { return Session.get('title') },
    err: function () { return Session.get('err') },
    cityList: function () {
        return Area.find()
    },
    warningList: function () {
        var w = Warning.find({}, { sort: { timestamp: -1 } }).fetch()
        w.forEach(function (e) {
            e.moment = moment(e.timestamp).format('YYYY-MM-DD')
        })
        return w;
    }
});

Template.airForecast.events({
    'click .saveWarningPassword': function (e, t) {
        Session.set('err', null);
        var content = t.$('textarea').val();
        var password = t.$('#warningPassword').val();
        var o = WarningPassword.findOne();
        if (password == '') Session.set('err', '密码不能为空！')
        else if (password != o.password) Session.set('err', '密码不正确！')
        else {
            t.$('#warningPassword').val('');
            t.$('#warningPasswordModal').modal('hide');
            Warning.insert({
                content: content,
                cityCode: parseInt($('select').val()),
                cityName: $('select').find("option:selected").text()
            }, function (err, id) {
                if (err)
                    Util.modal('全区空气质量预报发布', err)
                else {
                    $('textarea').val('')
                    Util.modal('全区空气质量预报发布', '发布成功！')
                    Meteor.call('push', function (err, res) {
                        //console.log(err, res)
                        if (err) {
                            Util.modal('全区空气质量预报发布', err)
                            console.log(err, res)
                        }
                    })
                }
            });
        }
    },
    'click .save': function (e, t) {
        var content = t.$('textarea').val();
        if (content.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
            Util.modal('全区空气质量预报发布', '发布内容为空！')
            return;
        }
        Session.set('title', '请输入 紧急污染预告推送密码')
        Session.set('err', null)
        t.$('#warningPassword').val('');
        t.$('#warningPasswordModal').modal();

    },
    'click .cancel': function () {
        $('textarea').val('')
    },
    'click .remove': function () {
        Warning.remove({ _id: this._id }, function (err) {
            if (err)
                Util.modal('全区空气质量预报发布', err)
            else {
                Util.modal('全区空气质量预报发布', '删除成功！')
            }
        });
    },
    'mouseenter tbody>tr': function () {
        $('#' + this._id).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function () {
        $('#' + this._id).css({
            'border': '1px dashed #D8D8D8',
        })
    }
});

Template.airForecast.onRendered(function () {
    $('#date').datepicker({
        language: "zh-CN",
        //autoclose: true
    });
    //$('#date').datepicker('setDate', new Date())
    $('#date').datepicker('setDate', new Date(Number(this.data.date)));
    $('#date').datepicker('setStartDate', (function () {
        var d = new Date();
        d.setDate(d.getDate() - 60);
        return d;
    })())
    $('#date').datepicker('setEndDate', new Date())
}
);

Template.airForecast.onCreated(function () {

}
);