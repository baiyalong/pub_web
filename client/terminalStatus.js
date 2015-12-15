/**
 * Created by bai on 2015/11/19.
 */
/**
 * Created by bai on 2015/9/11.
 */


Template.terminalStatus.helpers({
    terminalList: function () {
        return Terminal.find({}, {sort: {'timestamp': -1}});
    },
    getTime: function (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    }
});

Template.terminalStatus.events({
    'click .remove': function () {
        Terminal.remove({_id: this._id})
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

Template.terminalStatus.onRendered(function () {

    }
);

Template.terminalStatus.onCreated(function () {
    }
);