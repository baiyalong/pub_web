/**
 * Created by bai on 2015/9/14.
 */

Template.ipTrustList.helpers({
    title: function () { return 'IP地址信任列表' },
    err: function () { return Session.get('err') },
    ipList: function () {
        return IPTrustList.find({}, { sort: { 'timestamp': -1 } });
    }
});

Template.ipTrustList.events({
    'click .edit': function (e, t) {
        Session.set('err', null)
        Session.set('editID', this._id)
        t.$('#ipAddr').val(this.ipAddr);
        t.$('#description').val(this.description);
        t.$('#appModal').modal()
    },
    'click button.add': function (e, t) {
        Session.set('err', null)
        Session.set('editID', null)
        t.$('#appModal').modal()
    },
    'click .cancel': function (e, t) {
        t.$('#ipAddr').val('');
        t.$('#description').val('');
    },
    'click .save': function (e, t) {
        Session.set('err', null)
        var ipAddr = t.$('#ipAddr').val().trim();
        var description = t.$('#description').val().trim();
        if (ipAddr == '') {
            Session.set('err', 'IP地址不能为空！');
            return;
        }
        var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = ipAddr.match(exp);
        if (reg == null) {
            Session.set('err', 'IP地址格式不正确！');
            return;
        }
        if (description == '') {
            Session.set('err', '描述不能为空！');
            return;
        }
        var id = Session.get('editID')
        if (id) {
            Meteor.call('updateIP', id, ipAddr, description, function (err) {
                if (err) Util.modal('IP地址信任列表', err);
                else {
                    t.$('#appModal').modal('hide')
                    Util.modal('IP地址信任列表', '更新成功！');
                    t.$('#ipAddr').val('');
                    t.$('#description').val('');
                }
            })
        } else {
            Meteor.call('addNewIP', ipAddr, description, function (err) {
                if (err) Util.modal('IP地址信任列表', err);
                else {
                    t.$('#appModal').modal('hide')
                    Util.modal('IP地址信任列表', '添加成功！');
                    t.$('#ipAddr').val('');
                    t.$('#description').val('');
                }
            })
        }
    },
    'click .remove': function () {
        if (confirm('确认要删除吗？'))
            IPTrustList.remove({ _id: this._id }, function (err) {
                if (err) Util.modal('IP地址信任列表', err);
                else;
                // Util.modal('IP地址信任列表', '删除成功！');
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
