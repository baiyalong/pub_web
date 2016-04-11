/**
 * Created by bai on 2015/9/7.
 */

Template.dataSync.helpers({
    recordList: function() {
        return DataStationHourlyReSyncRecord.find({}, { sort: { tStart: -1 } }).map(function(e) {
            return {
                _id: e._id,
                date: moment(e.date).format('YYYY-MM-DD'),
                success: e.success ? '成功' : '失败',
                tStart: moment(e.tStart).format('YYYY-MM-DD HH:mm:ss'),
                tEnd: moment(e.tEnd).format('YYYY-MM-DD HH:mm:ss')
            }
        })
    },
});

Template.dataSync.events({
    'click .sync': function(e, t) {
        e.preventDefault()
        var dateFrom = $('#dateFrom').datepicker('getDate')
        var dateTo = $('#dateTo').datepicker('getDate')
        Util.modal('数据重新同步', '任务已提交给后台处理！')
        Meteor.call('dataStationHourlyReSync', dateFrom, dateTo)
    },
    'mouseenter tbody>tr': function() {
        $('#' + this._id).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function() {
        $('#' + this._id).css({
            'border': '1px dashed #D8D8D8',
        })
    },
    'click .remove': function() {
        console.log(this)
        DataStationHourlyReSyncRecord.remove({ _id: this._id }, function(err, res) {
            if (err)
                console.log(err)
        });
    },

});

Template.dataSync.onRendered(function() {

    $('#daterange').datepicker({
        language: "zh-CN"
    });

    $('#dateFrom').datepicker('setDate', new Date())
    $('#dateTo').datepicker('setDate', new Date())
    $('#dateFrom').datepicker('setStartDate', (function() {
        var d = new Date();
        d.setDate(d.getDate() - 60);
        return d;
    })())
    $('#dateTo').datepicker('setStartDate', (function() {
        var d = new Date();
        d.setDate(d.getDate() - 60);
        return d;
    })())
    $('#dateFrom').datepicker('setEndDate', new Date())
    $('#dateTo').datepicker('setEndDate', new Date())

    // $('.mainR').scroll(function() {
    //     var scrollValue = Session.get('scrollValue')
    //     if ($('.mainR').scrollTop() > scrollValue) {
    //         Session.set('limit', Session.get('limit') + 20);
    //         Session.set('scrollValue', scrollValue + $('.mainR').height())
    //     }
    // });
}
);

Template.dataSync.onCreated(function() {
    Session.set('pages_method', 'dataStationHourlyReSyncRecord_pages')
    Session.set('collection', 'dataStationHourlyReSyncRecord')
    Session.set('filter',{})
}
);