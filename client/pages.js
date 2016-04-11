/**
 * Created by bai on 2015/9/7.
 */

Template.pages.helpers({
    pageList: function() {
        var pages = Session.get('pages')
        var page = Session.get('page')
        var res = []
        var p_start = 1, p_end = 1;
        if (page <= 6) { p_start = 1, p_end = 11 }
        else if (page >= pages - 6) { p_start = pages - 11, p_end = pages }
        else { p_start = page - 5, p_end = page + 5 }
        p_start = Math.max(1, p_start)
        p_end = Math.min(pages, p_end)
        for (var i = p_start; i <= p_end; i++) {
            res.push({
                page: i,
                active: (function() {
                    return i == page ? 'btn-success' : ''
                })()
            })
        }
        return res;
    }

});

Template.pages.events({

    'click .page': function() {
        if (!this.page) return;
        if (this.page != Session.get('page'))
            Session.set('page', this.page)
    },
    'click .page.pre': function() {
        var page = Session.get('page')
        if (page != 1)
            Session.set('page', page - 1)
    },
    'click .page.next': function() {
        var page = Session.get('page')
        if (page != Session.get('pages'))
            Session.set('page', page + 1)
    }


});

Template.pages.onRendered(function() {

}
);

Template.pages.onCreated(function() {
    Session.set('page', 1);
    Session.set('count', 12);


    Tracker.autorun(function() {
        Meteor.subscribe(Session.get('collection'), Session.get('page'), Session.get('count'), Session.get('filter'));
        Meteor.call(Session.get('pages_method'), Session.get('count'), Session.get('filter'), function(err, res) {
            Session.set('pages', res)
        })
    });
}
);