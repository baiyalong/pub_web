/**
 * Created by bai on 2015/8/20.
 */

Template.user.helpers({
    'readonly': function () {
        if (Session.get('title') == '修改用户')
            return 'readonly';
        if (Session.get('title') == '紧急污染预告推送密码设置')
            return 'readonly';
    },
    'title': function () {
        return Session.get('title')
    },
    'err': function () {
        return Session.get('err')
    },
    'userList': function () {
        return Meteor.users.find()
    },
    'rolesList': function () {
        var res = [
            { name: '自治区管理员', value: 'admin' },
            { name: '自治区预报审核员', value: 'audit' }
        ]
        Area.find().forEach(function (e) {
            res.push({
                name: '盟市预报发布员 / ' + e.name,
                value: e.code.toString()
            })
        });
        return res;
    },
    'roleName': function (r) {
        if (!r) return;
        var role = r[0];
        var roles = [
            { name: '自治区管理员', value: 'admin' },
            { name: '自治区预报审核员', value: 'audit' }
        ]
        Area.find().forEach(function (e) {
            roles.push({
                name: '盟市预报发布员 / ' + e.name,
                value: e.code.toString()
            })
        });
        var res = roles.find(function (e) {
            return e.value == role
        });
        return res ? res.name : role;
    }
});

Template.user.events({
    'click .warningPassword': function (e, t) {
        Session.set('title', '紧急污染预告推送密码设置');
        Session.set('err', null);
        var password = WarningPassword.findOne();
        t.$('#oldWarningPassword').val(password.password)
        t.$('#newWarningPassword').val('')
        t.$('#warningPasswordModal').modal();
    },
    'click .saveWarningPassword': function (e, t) {
        Session.set('err', null);
        var password = t.$('#newWarningPassword').val()
        var o = WarningPassword.findOne();
        if (password == '') Session.set('err', '密码不能为空！')
        else {
            WarningPassword.update(o._id, { $set: { password: password } }, function (err, res) {
                if (err)
                    Session.set('err', err.message)
                else {
                    Session.set('err', null)
                    t.$('#warningPasswordModal').modal('hide');
                    Util.modal('紧急污染预告推送密码设置', '设置成功！')
                }
            })
        }
    },
    'click .add': function (e, t) {
        Session.set('title', '添加用户');
        Session.set('err', null);
        t.$('#username').val('')
        t.$('#password').val('')
        t.$('#userModal').modal();
    },
    'click .edit': function (e, t) {
        Session.set('title', '修改用户');
        Session.set('err', null);
        t.$('#username').val(this.username)
        t.$('#password').val('')
        t.$('#userModal').modal();
    },
    'click .remove': function (e, t) {
        if (confirm('确认要删除该用户吗？'))
            Meteor.call('removeUser', this._id)
    },
    'click .save': function (e, t) {
        Session.set('err', null);
        var username = t.$('#username').val().trim()
        var password = t.$('#password').val();
        var role = t.$('#role').val()

        if (username == '') Session.set('err', '用户名不能为空！')
        else if (password == '') Session.set('err', '密码不能为空！')

        else if (Session.get('title') == '添加用户') {
            if (Meteor.users.findOne({ username: username })) Session.set('err', '用户名已被占用！')
            else {
                Meteor.call('addUser', username, password, role, function (err, res) {
                    if (err)
                        Session.set('err', err.message)
                    else {
                        Session.set('err', null)
                        t.$('#userModal').modal('hide');
                        t.$('#username').val('')
                        t.$('#password').val('')
                        Util.modal('添加用户', '添加成功！')
                    }
                })
            }
        }
        else if (Session.get('title') == '修改用户') {
            Meteor.call('updateUser', username, password, role, function (err, res) {
                if (err)
                    Session.set('err', err.message)
                else {
                    Session.set('err', null)
                    t.$('#userModal').modal('hide');
                    t.$('#username').val('')
                    t.$('#password').val('')
                    Util.modal('修改用户', '修改成功！')
                }
            })
        }


        //console.log(username, password, role)
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
})
;

Template.user.onRendered(function () {

}
    );

Template.user.onCreated(function () {
}
    );