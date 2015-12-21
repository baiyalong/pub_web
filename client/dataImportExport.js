/**
 * Created by bai on 2015/9/7.
 */

Template.dataImportExport.helpers({
    cityList: function () {
        return Area.find()
    },
    stationList: function () {
        return Station.find()
    },

});

Template.dataImportExport.events({
    'click .import': function (e, t) {
        t.$('#fileUpload').click();
        switch (e.target.parentNode.parentNode.id) {
            case 'dStation': break;
            case 'dCorrect': break;
            case 'dLimit': break;
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
            case 'dCorrect':
                t.$('#modalCorrect').modal();
                break;
            case 'dLimit': 
                Meteor.call('exportLimit', function (err, res) {
                    if (err) console.log(err)
                    else {
                        downloadFile('污染物发布限值.csv',
                            Papa.unparse(JSON.stringify(res)))
                    }
                })
                break;
            case 'dWarning': 
                Meteor.call('exportWarning', function (err, res) {
                    if (err) console.log(err)
                    else {
                        downloadFile('紧急污染预告发布历史记录.csv',
                            Papa.unparse(JSON.stringify(res)))
                    }
                })
                break;
            case 'dForecast': 
                Meteor.call('exportForecast', function (err, res) {
                    if (err) console.log(err)
                    else {
                        downloadFile('空气质量预报审核历史记录.csv',
                            Papa.unparse(JSON.stringify(res)))
                    }
                })
                break;
            default: ;
        }
    },
    'click .downloadCorrect': function (e, t) {
        var date = $('#date').datepicker('getDate');
        var city = parseInt($('#city').val());
        var station = parseInt($('#station').val());
        // console.log(date, city, station)
        Meteor.call('exportCorrect', date, station, function (err, res) {
            // console.log(err,res)
            if (err) console.log(err)
            else {
                downloadFile('点位数据修正列表.csv',
                    Papa.unparse(JSON.stringify(res)))
            }
            t.$('#modalCorrect').modal('hide');
        })
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
    },
    'change #city': function () {
        var city = parseInt($('#city').val())
        var select = false;
        $('#station option').each(function () {
            var position = parseInt($(this).attr('value'))
            if (position > city * 1000 && position < (city + 1) * 1000) {
                $(this).show()
                if (!select) {
                    select = true;
                    $('#station').val(position)
                }
            } else {
                $(this).hide()
            }
        })
    },
    'change #station': function () {
    },
});

Template.dataImportExport.onRendered(function () {


    $('#date').datepicker({
        language: "zh-CN",
        //autoclose: true
    });
    //$('#date').datepicker('setDate', new Date())
    $('#date').datepicker('setDate', new Date());
    $('#date').datepicker('setStartDate', (function () {
        var d = new Date();
        d.setDate(d.getDate() - 60);
        return d;
    })())
    $('#date').datepicker('setEndDate', new Date())


    $('#city').val(150100)
    var city = parseInt($('#city').val())
    var station = parseInt($('#station').val())
    if (!isNaN(city) && !isNaN(station)) {
        var select = false;
        $('#station option').each(function () {
            var position = parseInt($(this).attr('value'))
            if (position > city * 1000 && position < (city + 1) * 1000) {
                $(this).show()
                if (!select) {
                    select = true;
                    $('#station').val(position)
                }
            } else {
                $(this).hide()
            }
        })
    }



}
    );

Template.dataImportExport.onCreated(function () {

}
    );


function downloadFile(fileName, content) {
    var aLink = document.createElement('a');
    var blob = new Blob(["\ufeff" + content], { type: 'application/vnd.ms-excel;charset=gb2312' });
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}