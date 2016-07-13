/**
 * Created by bai on 2015/9/7.
 */

Template.airQualityPublish.helpers({
    airQualityModel: function () {
        return Session.get('airQualityModel')
    },
    // getPrimaryPollutant: function (primaryPollutant) {
    //     return Pollutant.findOne({ pollutantCode: Number(primaryPollutant) }).pollutantName
    // },
    // getAirIndexLevel: function (airIndexLevel) {
    //     return ['一级', '二级', '三级', '四级', '五级', '六级'][airIndexLevel - 1]
    // },
    moment: function (date) {
        return moment(date).format('YYYY-MM-DD')
    },
    momentShort: function (date) {
        return moment(date).format('MM-DD')
    },
    airQualityList: function () {
        return AirQuality.find({
            cityCode: Number(Session.get('cityCode')), date: {
                $lt: (function () {
                    var d = new Date();
                    d.setDate(d.getDate() - 1);
                    return d;
                })()
            }
        }, { sort: { date: -1 } })
    },
    statusColor: function (statusCode) {
        var dict = {
            '-2': 'DarkGray',//未提交
            '-1': 'DarkRed',//退回修改
            '0': 'Darkorange',//已提交未审核
            '1': 'DarkGoldenRod',//审核通过
            '2': 'DarkGreen',//已发布
        }
        return dict[statusCode]
    },
    auditOption: function () {
        var applied = Session.get('airQuality');
        if (applied) return applied.auditOption;
    },
    description: function () {
        var applied = Session.get('airQuality');
        if (applied) return applied.applyContent.description;
    },
    selectPrimaryPollutant: function (name) {
        return [{ code: 0, name: '--请选择--' },
            { code: -1, name: '-' },
            { code: 1, name: 'SO₂' },
            { code: 2, name: 'NO₂' },
            { code: 3, name: 'O₃' },
            { code: 4, name: 'CO' },
            { code: 5, name: 'PM10' },
            { code: 6, name: 'PM2.5' },
        ]
            .map(function (e) {
                if (e.name == name)
                    e.selected = 'selected'
                return e;
            })
    },
    selectAirIndexLevel: function (name) {
        return [{ code: 0, name: '--请选择--' },
            { code: 1, name: '优' },
            { code: 2, name: '优-良' },
            { code: 3, name: '良' },
            { code: 4, name: '良-轻度污染' },
            { code: 5, name: '轻度污染' },
            { code: 6, name: '轻度-中度污染' },
            { code: 7, name: '中度污染' },
            { code: 8, name: '中度-重度污染' },
            { code: 9, name: '重度污染' },
            { code: 10, name: '重度-严重污染' },
            { code: 11, name: '严重污染' }]
            .map(function (e) {
                if (e.name == name)
                    e.selected = 'selected'
                return e;
            })
    },
    forecastList: function () {
        var applied = Session.get('airQuality');
        var line = Session.get('showLine') || 1;
        if (applied) {
            // line = applied.applyContent.detail.length;
            // Session.set('showLine',line)
        }
        var areaCode = Number(Session.get('areaCode'));
        var day = function (n) {
            var date = new Date();
            date.setDate(date.getDate() + n);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            return date;
        }
        var arrLine = function (n) {
            var res = {
                date: day(n),
                dateString: moment(day(n)).format('YYYY-MM-DD'),
                showDetele: (function () {
                    if (n == 1) return false;
                    else if (n == 2) {
                        if (line == 2) return true;
                        else return false;
                    }
                    else if (n == 3) return true;
                })()
            }
            var data = null;
            if (applied) {
                data = applied.applyContent.detail[n - 1]
            } else {
                var date = new Date();
                date.setDate(date.getDate() + n);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                var d1 = new Date(date);
                d1.setSeconds(d1.getSeconds() - 1);
                var d2 = new Date(date);
                d2.setSeconds(d2.getSeconds() + 1);
                data = DataAirQuality.findOne({ areaCode: areaCode, date: { $gte: d1, $lte: d2 }, description: { $exists: false } })
            }
            if (data) {
                res.primaryPollutant = data.primaryPollutant;
                res.airIndexLevel = data.airIndexLevel;
                res.airQualityIndex = data.airQualityIndex;
            }
            return res;
        }
        var res = [];
        for (var i = 1; i <= 3; i++)
            res.push(arrLine(i))
        return res.slice(0, line)
    },
    today: function () {
        return moment(new Date()).format('YYYY-MM-DD')
    },
    currentStatusCode: function () {
        var applied = Session.get('airQuality');
        return applied && applied.statusCode || 0;
    },
    currentStatusName: function () {
        var applied = Session.get('airQuality');
        return applied && applied.statusName || '草稿';
    },
    cityList: function () {
        return Area.find({ $and: [{ code: { $mod: [100, 0] } }, { code: { $not: { $mod: [10000, 0] } } }] }, { sort: { code: 1 } });
    },
    countyList: function () {
        return Area.find();
    },
    // airQualityList: function () {
    //     var w = AirQuality.find({ userId: Meteor.userId() }, { sort: { timestamp: -1 } }).fetch()
    //     w.forEach(function (e) {
    //         e.moment = moment(e.date).format('YYYY-MM-DD')
    //         e.statusColor = e.statusCode == 1 ? 'green' : e.statusCode == -1 ? 'red' : '';
    //     })
    //     return w;
    // },
    operation: function (statusCode) {
        return statusCode;
    },
});

Template.airQualityPublish.events({
    'click .detail': function (e, t) {
        Session.set('airQualityModel', this)
        t.$('#airQualityDetailModal').modal()
    },
    'change .airQualityIndex': function (e, t) {
        // var aqi = t.$(this).find('input.airQualityIndex').val().trim();
        var aqi = e.target.value;
        //    console.log(aqi)
        if (!/\d-\d/.test(aqi)) return;
        var arr = aqi.split('-');
        var min = parseInt(arr[0]), max = parseInt(arr[1]);
        if (!(min <= max && min >= 0)) return;

        var rule = [0, 50, 100, 150, 200, 300, 9999]
        var res = 0;
        function inRange(val, min, max) {
            return val > min && val <= max;
        }
        if (inRange(max, rule[0], rule[1])) res = 1;
        else if (inRange(min, rule[0], rule[1]) && inRange(max, rule[1], rule[2])) res = 2;
        else if (inRange(min, rule[1], rule[2]) && inRange(max, rule[1], rule[2])) res = 3;
        else if (inRange(min, rule[1], rule[2]) && inRange(max, rule[2], rule[3])) res = 4;
        else if (inRange(min, rule[2], rule[3]) && inRange(max, rule[2], rule[3])) res = 5;
        else if (inRange(min, rule[2], rule[3]) && inRange(max, rule[3], rule[4])) res = 6;
        else if (inRange(min, rule[3], rule[4]) && inRange(max, rule[3], rule[4])) res = 7;
        else if (inRange(min, rule[3], rule[4]) && inRange(max, rule[4], rule[5])) res = 8;
        else if (inRange(min, rule[4], rule[5]) && inRange(max, rule[4], rule[5])) res = 9;
        else if (inRange(min, rule[4], rule[5]) && inRange(max, rule[5], rule[6])) res = 10;
        else if (inRange(min, rule[5], rule[6])) res = 11;
        else { alert('数值范围过大！'); return; }

        // t.$(this).find('select.airIndexLevel').val(res);
        var text = [{ code: 0, name: '--请选择--' },
            { code: 1, name: '优' },
            { code: 2, name: '优-良' },
            { code: 3, name: '良' },
            { code: 4, name: '良-轻度污染' },
            { code: 5, name: '轻度污染' },
            { code: 6, name: '轻度-中度污染' },
            { code: 7, name: '中度污染' },
            { code: 8, name: '中度-重度污染' },
            { code: 9, name: '重度污染' },
            { code: 10, name: '重度-严重污染' },
            { code: 11, name: '严重污染' }];

        $(e.target.parentNode.parentNode).find('select.airIndexLevel')
            .val(text.filter(function (e) { return e.code == res })[0].name)

        if (res == 1)
            $(e.target.parentNode.parentNode).find('select.primaryPollutant').val('-')

    },
    // 'blur .aqiMin':function(e,t){
    //    var min = t.$(this).find('input.aqiMin').val().trim();
    //    console.log(min)
    // },
    // 'blur .aqiMax':function(e,t){

    // },
    'click .add': function () {
        var line = Session.get('showLine') || 1;
        if (line == 1 || line == 2) Session.set('showLine', line + 1);
        else if (line == 3);
    },
    'click .delete': function () {
        var line = Session.get('showLine') || 1;
        if (line == 1);
        else if (line == 2 || line == 3) Session.set('showLine', line - 1);
    },
    // 'change #city': function () {
    //     var city = parseInt($('#city').val())
    //     var select = false;
    //     $('#county option').each(function () {
    //         var county = parseInt($(this).attr('value'))
    //         if (county > city && county < (city + 100)) {
    //             $(this).show()
    //             if (!select) {
    //                 select = true;
    //                 $('#county').val(county)
    //             }
    //         } else {
    //             $(this).hide()
    //         }
    //     })
    // },
    'click .save': function (e, t) {
        // var content = $('textarea').val();
        // // if (content.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
        // //     Util.modal('空气质量预报发布', '发布内容为空！')
        // //     return;
        // // }
        var err = false;
        var data = {
            // date: (function () { var date = new Date(); date.setHours(0); date.setMinutes(0); date.setSeconds(0); return date; })(),
            cityCode: Number(t.$('#city').find('option:selected').val()),
            cityName: t.$('#city').find('option:selected').text(),
            areaCode: Number(t.$('#county').find('option:selected').val()),
            areaName: t.$('#county').find('option:selected').text(),
            statusCode: 0,
            statusName: '已提交',
            applyUserName: Meteor.user().username,
            applyTimestamp: new Date(),
            applyContent: {
                detail: (function () {
                    var res = []
                    t.$('table.forecastDetail tbody tr').each(function () {
                        var line = {
                            date: t.$(this).attr('date'),
                            primaryPollutant: t.$(this).find('select.primaryPollutant').val(),
                            airIndexLevel: t.$(this).find('select.airIndexLevel').val(),
                            airQualityIndex: t.$(this).find('input.airQualityIndex').val().trim(),
                        }
                        if (line.primaryPollutant == '--请选择--' ||
                            line.airIndexLevel == '--请选择--' ||
                            line.airQualityIndex == '')
                            err = true;
                        res.push(line)
                    })
                    return res;
                })(),
                description: t.$('textarea').val().trim() || ''
            }
        }
        if (err) Util.modal('空气质量预报发布', '输入参数错误！')
        else {
            Meteor.call('applyAirQuality', data, function (err, res) {
                if (err)
                    Util.modal('空气质量预报发布', err.message)
                else
                    Util.modal('空气质量预报发布', '提交成功！')
            })
        }
    },
    'click .cancel': function () {
        $('textarea').val('')
        Session.set('_id', '')
        $('#date').val(moment(new Date()).format('YYYY-MM-DD'));
        var city = parseInt($('#city').val())
        var county = parseInt($('#county').val())
        if (!isNaN(city) && !isNaN(county)) {
            var select = false;
            $('#county option').each(function () {
                var county = parseInt($(this).attr('value'))
                if (county > city && county < (city + 100)) {
                    $(this).show()
                    if (!select) {
                        select = true;
                        $('#county').val(county)
                    }
                } else {
                    $(this).hide()
                }
            })
        }
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

Template.airQualityPublish.onRendered(function () {
    Session.set('_id', '')

    $('#date').datepicker({
        language: "zh-CN",
        //autoclose: true
    });
    //$('#date').datepicker('setDate', new Date())
    $('#date').datepicker('setDate', new Date());
    $('#date').datepicker('setStartDate', new Date())
    //$('#date').datepicker('setEndDate', new Date())

    var city = null, county = null;
    var role = Roles.getRolesForUser(Meteor.userId())
    if (role && role[0]) city = Number(role[0])
    if (city == 152500) county = 152502;
    else if (city == 152900) county = 152921;
    else county = city + 1;
    $('#city').val(city)
    $('#county').val(county)

    // var city = parseInt($('#city').val())
    // var county = parseInt($('#county').val())
    // if(county==152501)county=152502;
    // if (!isNaN(city) && !isNaN(county)) {
    //     var select = false;
    //     $('#county option').each(function () {
    //         var county = parseInt($(this).attr('value'))
    //         if (county > city && county < (city + 100)) {
    //             $(this).show()
    //             if (!select) {
    //                 select = true;
    //                 $('#county').val(county)
    //             }
    //         } else {
    //             $(this).hide()
    //         }
    //     })
    // }

    Session.set('cityCode', city)
    Session.set('areaCode', county)
    Session.set('showLine', 1)


    this.autorun(function () {
        var res = AirQuality.findOne({
            cityCode: Number($('#city').val()), date: {
                $gt: (function () {
                    var date = new Date();
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    return date;
                } ())
            }
        })
        Session.set('airQuality', res)
        if (res)
            Session.set('showLine', res.applyContent.detail.length)
        // console.log(res)
    })

    //  $('.mainR').scroll(function() {
    //     var scrollValue = Session.get('scrollValue')
    //     if ($('.mainR').scrollTop() > scrollValue) {
    //         Session.set('limit', Session.get('limit') + 20);
    //         Session.set('scrollValue', scrollValue + $('.mainR').height())
    //     }
    // });

}
)
    ;

Template.airQualityPublish.onCreated(function () {
    Session.set('pages_method', 'airQuality_pages')
    Session.set('collection', 'airQuality')

    var city = null;
    var role = Roles.getRolesForUser(Meteor.userId())
    if (role && role[0]) city = Number(role[0])
    Session.set('filter', { cityCode: city })
}
);
