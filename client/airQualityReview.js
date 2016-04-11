/**
 * Created by bai on 2015/10/13.
 */
/**
 * Created by bai on 2015/9/14.
 */

Template.airQualityReview.helpers({
        airQualityModel:function(){
        return Session.get('airQualityModel')
    },
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
        return statusCode = 1 ? 'green' : statusCode == -1 ? 'red' : '';
    },
    moment: function (date) {
        return moment(date).format('YYYY-MM-DD')
    },
    momentShort: function (date) {
        return moment(date).format('MM-DD')
    },
    airQualityList: function () {
        return AirQuality.find({date:{$gt:(function(){
            var d = new Date();
            d.setDate(d.getDate()-1);
            return d;
        })()}}, { sort: { date: -1 } })
    },
    airQualityListHistory: function () {
        return AirQuality.find({date:{$lt:(function(){
            var d = new Date();
            d.setDate(d.getDate()-1);
            return d;
        })()}}, { sort: { date: -1 } })
    },
   
});

Template.airQualityReview.events({
    'click .pubBtn':function(e,t){
        Meteor.call('publishAirQuality',function(err,res){
            if(err)
                Util.modal('空气质量预报审核', err);
            else 
                Util.modal('空气质量预报审核', '发布成功！');
        })
    },
    'click .detail':function(e,t){
        Session.set('airQualityModel',this)
        t.$('#airQualityDetailModal').modal()
    },
    'click .audit': function (e, t) {
        var update = Session.get('auditStatus');
        update.auditOption = t.$('textarea').val().trim()
        console.log(update)
        Meteor.call('auditAirQuality', Session.get('auditID'), update, function (err, res) {
            if (err) Util.modal('空气质量预报审核', err);
            t.$('#auditOption').modal('hide');
        })
    },
    'click .pass': function (e, t) {
        t.$('textarea').val('')
        Session.set('err', null);
        Session.set('title', '审核通过')
        Session.set('auditID', this._id)
        Session.set('auditStatus', { statusCode: 1, statusName: '审核通过' })
        t.$('#auditOption').modal();
    },
    'click .back': function (e, t) {
        t.$('textarea').val('')
        Session.set('err', null);
        Session.set('title', '退回修改')
        Session.set('auditID', this._id)
        Session.set('auditStatus', { statusCode: -1, statusName: '退回修改' })
        t.$('#auditOption').modal();
    },
    'click .remove': function () {
        if (confirm('确认要删除吗？'))
            Meteor.call('removeAirQuality', this._id, this.statusCode, function (err, res) {
                if (err) Util.modal('空气质量预报审核', err);
                else
                    Util.modal('空气质量预报审核', '删除成功！');
            })
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

Template.airQualityReview.onRendered(function() {
    // $('.mainR').scroll(function() {
    //     var scrollValue = Session.get('scrollValue')
    //     if ($('.mainR').scrollTop() > scrollValue) {
    //         Session.set('limit', Session.get('limit') + 20);
    //         Session.set('scrollValue', scrollValue + $('.mainR').height())
    //     }
    // });
}
);

Template.airQualityReview.onCreated(function() {
    Session.set('pages_method', 'airQuality_pages')
    Session.set('collection', 'airQuality')
    Session.set('filter',{})
})
