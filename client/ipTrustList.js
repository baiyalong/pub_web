/**
 * Created by bai on 2015/9/14.
 */

Template.ipTrustList.helpers({
    ipList: function () {
        return IPTrustList.find({}, {sort: {'timestamp': -1}});
    }
});

Template.ipTrustList.events({
    'click .cancel': function () {
        $('#ipAddr').val('');
        $('#description').val('');
    },
    'click .save': function () {
        var ipAddr = $('#ipAddr').val().trim();
        var description = $('#description').val().trim();
        if (ipAddr == '') {
            alert('IP地址不能为空！');
            return;
        }
        var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = ipAddr.match(exp);
        if (reg == null) {
            alert('IP地址格式不正确！');
            return;
        }
        if (description == null) {
            alert('描述不能为空！');
            return;
        }
        Meteor.call('addNewIP', ipAddr, description, function (err) {
            if (err)Util.modal('IP地址信任列表', err);
            else {
                Util.modal('IP地址信任列表', '添加成功！');
                $('#ipAddr').val('');
                $('#description').val('');
            }
        })
    },
    'click .remove': function () {
        IPTrustList.remove({_id: this._id}, function (err) {
            if (err)Util.modal('IP地址信任列表', err);
            else
                Util.modal('IP地址信任列表', '删除成功！');
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

Template.ipTrustList.onRendered(function () {

    }
);

Template.ipTrustList.onCreated(function () {

})
