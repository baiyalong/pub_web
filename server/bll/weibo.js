
Meteor.methods({
    weiboVarList: function() {
        function aqiDaily(cityCode) {
            var data = DataCityDaily.findOne({ CITYCODE: cityCode.toString() }, { sort: { MONITORTIME: -1 } })
            return data && data.AQI ? data.AQI : 0;
        }
        return [
            {
                code: '0',
                name: '&&todayforecast',
                description: '今天的全区空气质量预报信息',
                value: (function() {
                    var data = DataAirForecast.findOne({}, { sort: { publishtime: -1 } })
                    return data ? data.publishcontent || '' : '';
                })()
            },
            {
                code: '1',
                name: '&&hhhtaqi',
                description: '昨天的呼和浩特市AQI日报数据',
                value: aqiDaily(150100)
            },
            {
                code: '2',
                name: '&&btaqi',
                description: '昨天的包头市AQI日报数据',
                value: aqiDaily(150200)
            },
            {
                code: '3',
                name: '&&whaqi',
                description: '昨天的乌海市AQI日报数据',
                value: aqiDaily(150300)
            },
            {
                code: '4',
                name: '&&cfaqi',
                description: '昨天的赤峰市AQI日报数据',
                value: aqiDaily(150400)
            },
            {
                code: '5',
                name: '&&tlaqi',
                description: '昨天的通辽市AQI日报数据',
                value: aqiDaily(150500)
            },
            {
                code: '6',
                name: '&&eedsaqi',
                description: '昨天的鄂尔多斯市AQI日报数据',
                value: aqiDaily(150600)
            },
            {
                code: '7',
                name: '&&hlbeaqi',
                description: '昨天的呼伦贝尔市AQI日报数据',
                value: aqiDaily(150700)
            },
            {
                code: '8',
                name: '&&byzeaqi',
                description: '昨天的巴彦淖尔市AQI日报数据',
                value: aqiDaily(150800)
            },
            {
                code: '9',
                name: '&&wlcbaqi',
                description: '昨天的乌兰察布市AQI日报数据',
                value: aqiDaily(150900)
            },
            {
                code: '10',
                name: '&&xamaqi',
                description: '昨天的兴安盟AQI日报数据',
                value: aqiDaily(152200)
            },
            {
                code: '11',
                name: '&&xlglmaqi',
                description: '昨天的锡林郭勒盟AQI日报数据',
                value: aqiDaily(152500)
            },
            {
                code: '12',
                name: '&&alsmmaqi',
                description: '昨天的阿拉善盟AQI日报数据',
                value: aqiDaily(152900)
            },
        ]
    },
    'weiboRecord_pages': function(count, filter) {
        if (!filter) filter = {}
        return Math.round(WeiboRecord.find(filter).count() / count)
    },
    weiboPublish: function(content) {
        var config = WeiboConfig.findOne();
        var varList = Meteor.call('weiboVarList');
        
        //weibo access token   --OAuth2
        HTTP.call('POST','https://api.weibo.com/oauth2/access_token',{data:{
            client_id:'3733414340',
            client_secret:'a0bb1256365fe8304398d7f9641d5488',
            grant_type:'authorization_code',
            code:config.code,
            redirect_uri:'http://106.74.0.132:4000/api/weibo/redirect_uri/'
        }},function(err,res){
            if(err)console.log('weibo access token  ',err,res)
            else
                HTTP.call('POST','https://api.weibo.com/2/statuses/update.json',{data:{
                    access_token:res.access_token,
                    status:data //URLEncode <140
                }},function(err,res){
                    console.log('weibo  publish',err,res)
                })
        })
        

    },
    weiboCronStart: function() {
        SyncedCron.add({
            name: 'weibo',
            schedule: function(parser) {
                // parser is a later.parse object
                return parser.text('every 10 s');
            },
            job: function() {
                console.log('weibo -- ' + new Date())
            }
        });
    },
    weiboCronStop: function() {
        SyncedCron.remove('weibo')
    },
    
    
    weibo_authorize:function(){
        HTTP.call('POST','https://api.weibo.com/oauth2/authorize',{data:{
            client_id:3733414340,
            redirect_uri:'http://106.74.0.132:4000/api/weibo/redirect_uri'
        }},function(err,res){
            console.log(err,res)
        })
    },
    weibo_accessToken:function(){},
    
});
