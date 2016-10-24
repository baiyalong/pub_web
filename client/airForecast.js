/**
 * Created by bai on 2015/9/7.
 */

Template.airForecast.helpers({
    title: function () { return Session.get('title') },
    err: function () { return Session.get('err') },
    airForcastList: function () {
        return DataAirForecast.find({}, { sort: { publishtime: -1 } })
    },
    moment: function (publishtime) {
        // var date = new Date(publishtime)
        // if (date == 'Invalid Date')
        return publishtime && publishtime.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) || ''
        // else return moment(date).format('YYYY-MM-DD')
    },
    getDate: function () {
        return moment(new Date()).format('YYYY年MM月DD日');
    }
});

Template.airForecast.events({
    'click .save': function (e, t) {
        var content = t.$('textarea').val();
        if (content.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
            Util.modal('全区空气质量预报发布', '发布内容为空！')
            return;
        }
        var date = new Date().toLocaleDateString();
        date = date.split('/')
        date.push('00')
        date = date.join('')
        DataAirForecast.upsert({
            publishtime: date
        }, {
                $set: {
                    publishtime: date,
                    publishcontent: content,
                }
            }, function (err, id) {
                if (err)
                    Util.modal('全区空气质量预报发布', err)
                else {
                    $('textarea').val('')
                    Util.modal('全区空气质量预报发布', '发布成功！')
                }
            });
    },
    'click .cancel': function () {
        $('textarea').val('')
    },
    // 'click .remove': function () {
    //     Warning.remove({ _id: this._id }, function (err) {
    //         if (err)
    //             Util.modal('全区空气质量预报发布', err)
    //         else {
    //             Util.modal('全区空气质量预报发布', '删除成功！')
    //         }
    //     });
    // },
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
    // $('#date').datepicker({
    //     language: "zh-CN",
    //     //autoclose: true
    // });
    // //$('#date').datepicker('setDate', new Date())
    // $('#date').datepicker('setDate', new Date(Number(this.data.date)));
    // $('#date').datepicker('setStartDate', (function () {
    //     var d = new Date();
    //     d.setDate(d.getDate() - 60);
    //     return d;
    // })())
    // $('#date').datepicker('setEndDate', new Date())
}
);

Template.airForecast.onCreated(function () {
    Session.set('pages_method', 'dataAirForecast_pages')
    Session.set('collection', 'dataAirForecast')
    Session.set('filter', {})
}
);