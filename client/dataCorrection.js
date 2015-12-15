/**
 * Created by bai on 2015/9/7.
 */

Template.dataCorrection.helpers({
    cityList: function () {
        return Area.find()
    },
    stationList: function () {
        return Station.find()
    },
    dataList: function () {
        return DataStationHourly.find();
    },
    moment: function (t) {
        return moment(t).format('HH:mm:ss');
    },
    stationInfo: function () {
        var date = moment(new Date(Number(this.date))).format('YYYY年MM月DD日');
        var station = Station.findOne({ UniqueCode: Number(this.stationCode) })
        return {
            station: station.PositionName,
            city: station.Area,
            county: station.countyName,
            date: date
        }
    },
});

Template.dataCorrection.events({
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
    'click button.search': function (e) {
        e.preventDefault()
        var date = $('#date').datepicker('getDate');
        var city = parseInt($('#city').val());
        var station = parseInt($('#station').val());
        if (isNaN(city) || isNaN(station)) {
            Util.modal('点位数据修正', '输入参数错误！')
            return
        }

        Router.go('/dataCorrection/' + station + '/' + date.getTime())

    },
    'click button.cancel': function () {
        $('input[type=number]').each(function () {
            $(this).val($(this).attr('history'))
        })
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

Template.dataCorrection.onRendered(function () {

    $('#date').datepicker({
        language: "zh-CN",
        //autoclose: true
    });
    //$('#date').datepicker('setDate', new Date())
    $('#date').datepicker('setDate', new Date(Number(this.data.date)));
    $('#date').datepicker('setStartDate', (function () {
        var d = new Date();
        d.setDate(d.getDate() - 60);
        return d;
    })())
    $('#date').datepicker('setEndDate', new Date())


    $('#city').val(Math.floor(Number(this.data.stationCode) / 1000))
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
    $('#station').val(Number(this.data.stationCode))


    $('.editableCorrection').editable({
        url: function (params) {
            var pollutant = this.getAttribute('pollutant');
            var value = params.value;
            var id = this.parentElement.parentElement.getAttribute('id');
            //console.log(stationCode, monitorTime, pollutant, value, this, params)
            var d = new $.Deferred;
            //async saving data in js model\
            var update = {};
            update[pollutant] = value;
            DataStationHourly.update(id, { $set: update }, function (err, res) {
                if (err)
                    d.reject(err.message)
                else
                    d.resolve()
            })
            return d.promise();
        },
        emptytext: '',
        showbuttons: false,
        mode: 'inline',
        validate: function (value) {
            if ($.trim(value) == '') {
                return '输入不能为空！';
            }
            if (isNaN(Number(value))) {
                return '输入参数错误！'
            }
        }
    })
}
    );

Template.dataCorrection.onCreated(function () {

}
    );

