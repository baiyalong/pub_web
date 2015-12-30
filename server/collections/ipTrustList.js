/**
 * Created by bai on 2015/9/14.
 */

IPTrustList.attachSchema(new SimpleSchema({
    ipAddr: {
        type: String
    },
    description: {
        type: String
    },
    timestamp: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
}));

IPTrustList.allow({
    insert: function () {
        return true
    },
    remove: function () {
        return true;
    }
}
    )

Meteor.publish('ipTrustList', function () {
    return IPTrustList.find();
})

Meteor.methods({
    'addNewIP': function (ipAddr, description) {
        var ip = IPTrustList.findOne({ ipAddr: ipAddr })
        if (ip != null) {
            throw new Meteor.Error('IP地址重复', '当前IP地址已存在于IP地址信任列表中')
        } else {
            IPTrustList.insert({ ipAddr: ipAddr, description: description })
        }
    },
    'updateIP': function (id, ipAddr, description) {
        IPTrustList.update({ _id: id }, { $set: { ipAddr: ipAddr, description: description } })
    },
    'checkIP': function () {
        var ip = this.connection.clientAddress;
        return IPTrustList.findOne({ ipAddr: ip })
    },
    'getClientIP': function () {
        return this.connection.clientAddress;
    }
})


