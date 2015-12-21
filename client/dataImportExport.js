/**
 * Created by bai on 2015/9/7.
 */

Template.dataImportExport.helpers({
    err: function () { return Session.get('err') },
    importDataList: function () {
        var dataList = Session.get('importDataList') || [];
        return dataList.map(function (e) {
            e.importResult = e.res == undefined ? '' : e.res ? '成功' : '失败';
            return e;
        });
    },
    cityList: function () {
        return Area.find()
    },
    stationList: function () {
        return Station.find()
    },

});

Template.dataImportExport.events({
    'click .importConfirm': function () {
        function callMethod(methodName) {
            Meteor.call(methodName, Session.get('importDataList'), function (err, res) {
                if (err) alert(err)
                Session.set('importDataList', res)
            })
        }
        switch (Session.get('importType')) {
            case 'Station':
                callMethod('importStation')
                break;
            case 'Correct':
                callMethod('importCorrect')
                break;
            case 'Limit':
                callMethod('importLimit')
                break;
            default: ;
        }
    },
    'click .import': function (e, t) {
        switch (e.target.parentNode.parentNode.id) {
            case 'dStation':
                Session.set('importType', 'Station')
                break;
            case 'dCorrect':
                Session.set('importType', 'Correct')
                break;
            case 'dLimit':
                Session.set('importType', 'Limit')
                break;
            default: ;
        }
        t.$('#fileUpload').val('');
        t.$('#fileUpload').click();
    },
    'change #fileUpload': function (e, t) {
        var file = e.target.files[0];
        var arr = file.name.split('.');
        if (arr[arr.length - 1].toLowerCase() != 'csv' || file.type != 'application/vnd.ms-excel') {
            alert('文件格式错误！');
            return;
        }

        var reader = new FileReader();
        reader.readAsText(file)
        reader.onload = function (e) {
            var fileContent = e.target.result;
            Papa.parse(fileContent, {
                header: true,
                // worker: true,
                encoding: 'GB2312',
                complete: function (results) {
                    // console.log(results);
                    if (results.errors.length != 0) {
                        alert('文件解析错误！');
                        return;
                    }
                    Session.set('importDataList', results.data)
                    Session.set('err', null)
                    switch (Session.get('importType')) {
                        case 'Station':
                            t.$('#modalImportStation').modal();
                            break;
                        case 'Correct':
                            t.$('#modalImportCorrect').modal();
                            break;
                        case 'Limit':
                            t.$('#modalImportLimit').modal();
                            break;
                        default: ;
                    }

                }
            });
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