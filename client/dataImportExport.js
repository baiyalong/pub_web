/**
 * Created by bai on 2015/9/7.
 */

Template.dataImportExport.helpers({

});

Template.dataImportExport.events({

    'click .template': function (e, t) {
        switch (e.target.parentNode.parentNode.id) {
            case 'dStation':

                break;
            case 'dCorrect': break;
            case 'dLimit': break;
            // case 'dWarning': break;
            // case 'dForcast': break;
            default: ;
        }
    },
    'click .import': function (e, t) {
        switch (e.target.parentNode.parentNode.id) {
            case 'dStation': break;
            case 'dCorrect': break;
            case 'dLimit': break;
            // case 'dWarning': break;
            // case 'dForcast': break;
            default: ;
        }
    },
    'click .export': function (e, t) {
        switch (e.target.parentNode.parentNode.id) {
            case 'dStation':
                Meteor.call('exportStation', function (err, res) {
                    if (err) console.log(err)
                    else {
                        downloadFile('发布点位信息列表.csv',
                            Papa.unparse(JSON.stringify(res)))
                    }
                })
                break;
            case 'dCorrect': break;
            case 'dLimit': break;
            case 'dWarning': break;
            case 'dForcast': break;
            default: ;
        }
    },
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


function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}