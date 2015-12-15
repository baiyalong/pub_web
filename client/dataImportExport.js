/**
 * Created by bai on 2015/9/7.
 */

Template.dataImportExport.helpers({

});

Template.dataImportExport.events({

    'mouseenter tbody>tr': function (e, t) {
        var id = e.target.getAttribute('id');
        if (!id) return;
        t.$('#' + id).css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function (e, t) {
        var id = e.target.getAttribute('id');
        if (!id) return;
        t.$('#' + id).css({
            'border': '1px dashed #D8D8D8',
        })
    }
});

Template.dataImportExport.onRendered(function () {


}
    );

Template.dataImportExport.onCreated(function () {

}
    );

