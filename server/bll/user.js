/**
 * Created by bai on 2015/8/20.
 */
Meteor.publish(
    'user', function () {
        return Meteor.users.find()
    }
    //,
    //'userRoles', function () {
    //    return Meteor.roles.find()
    //}
)

Meteor.methods({
    'addUser': function (username, password, role) {
        var uid = Accounts.createUser({username: username, password: password});
        Roles.setUserRoles(uid, role)
    },
    'updateUser': function (username, password, role) {
        var user = Meteor.users.findOne({username: username})
        Accounts.setPassword(user._id, password)
        Roles.setUserRoles(user._id, role)
    },
    'removeUser': function (id) {
        Meteor.users.remove(id)
    }
})

