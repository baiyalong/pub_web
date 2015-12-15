/**
 * Created by bai on 2015/9/7.
 */

Template.pollutantLimit.helpers({
    limitList: function () {
        return Pollutant.find()
    }
});

Template.pollutantLimit.events({

    'mouseenter tbody>tr': function () {
        $('tbody>tr').css({
            'border': '2px solid #186E37',
            'border-width': '0 0 0 2px'
        })
    },
    'mouseleave tbody>tr': function () {
        $('tbody>tr').css({
            'border': '1px dashed #D8D8D8',
        })
    },
    '.editableLimit change': function () {
        console.log(this)
    }
});

Template.pollutantLimit.onRendered(function () {

    $('.editableLimit').editable({
        url: function (params) {
            //console.log(params)
            var d = new $.Deferred;
            //async saving data in js model\
            Pollutant.update({_id:params.name},{$set:{
                limit:Number(params.value)
            }},function(err,res){
                 if (err) {
                     console.log(err)
                    d.reject(err.message)
                }
                else {
                    d.resolve()
                }
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
            if (isNaN(Number(value)) || parseInt(value) < 0) {
                return '输入参数错误！'
            }
        }
    })
}
    );

Template.pollutantLimit.onCreated(function () {

}
    );