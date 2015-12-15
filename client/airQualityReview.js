/**
 * Created by bai on 2015/10/13.
 */
/**
 * Created by bai on 2015/9/14.
 */

Template.airQualityReview.helpers({
    title: function () {
        return Session.get('title')
    },
    err: function () {
        return Session.get('err')
    },
    notAudit: function (statusCode) {
        return statusCode == 0;
    },
    statusColor: function (statusCode) {
        return statusCode == 1 ? 'green' : statusCode == -1 ? 'red' : '';
    },
    getPrimaryPollutant: function (primaryPollutant) {
        return Pollutant.findOne({ pollutantCode: Number(primaryPollutant) }).pollutantName
    },
    getAirIndexLevel: function (airIndexLevel) {
        return ['一级', '二级', '三级', '四级', '五级', '六级'][airIndexLevel - 1]
    },
    moment: function (date) {
        return moment(date).format('YYYY-MM-DD')
    },
    momentShort: function (date) {
        return moment(date).format('MM-DD')
    },
    airQualityList: function () {
        return AirQuality.find({}, { sort: { timestamp: -1 } })
    }
});

Template.airQualityReview.events({
    'click .audit': function (e, t) {
        var update = Session.get('auditStatus');
        update.auditOption = t.$('textarea').val().trim()
        console.log(update)
        Meteor.call('auditAirQuality',Session.get('auditID'),update,function(err,res){
            if (err) Util.modal('空气质量预报审核', err);
            t.$('#auditOption').modal('hide');
        })
    },
    'click .pass': function (e, t) {
        Session.set('err', null);
        Session.set('title', '审核通过')
        Session.set('auditID', this._id)
        Session.set('auditStatus', { statusCode: 1, statusName: '审核通过' })
        t.$('#auditOption').modal();
    },
    'click .back': function (e, t) {
        Session.set('err', null);
        Session.set('title', '退回修改')
        Session.set('auditID', this._id)
        Session.set('auditStatus', { statusCode: -1, statusName: '退回修改' })
        t.$('#auditOption').modal();
    },
    'click .remove': function () {
        AirQuality.remove({ _id: this._id }, function (err) {
            if (err) Util.modal('空气质量预报审核', err);
            else
                Util.modal('空气质量预报审核', '删除成功！');
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

Template.airQualityReview.onRendered(function () {

}
    );

Template.airQualityReview.onCreated(function () {

})
