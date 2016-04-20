
Meteor.methods({
    weiboVarList: function () {
        function aqiDaily(cityCode) {

            var dateFrom = new Date();
            dateFrom.setHours(0);
            dateFrom.setMinutes(0);
            dateFrom.setSeconds(0);
            dateFrom.setDate(dateFrom.getDate() - 1);
            dateFrom.setSeconds(dateFrom.getSeconds() - 1);
            var dateTo = new Date(dateFrom);
            dateTo.setDate(dateTo.getDate() + 1);

            var data = DataCityDaily.findOne({ CITYCODE: cityCode.toString(), MONITORTIME: { $gt: dateFrom, $lt: dateTo } }, { sort: { MONITORTIME: -1 } })
            return data && data.AQI ? data.AQI : null;
        }
        return [
            {
                code: '0',
                name: '&&todayforecast',
                description: '今天的全区空气质量预报信息',
                value: (function () {
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
    'weiboRecord_pages': function (count, filter) {
        if (!filter) filter = {}
        return Math.round(WeiboRecord.find(filter).count() / count)
    },
    weiboCronStart: function () {
        var config = WeiboConfig.findOne();
        SyncedCron.add({
            name: 'weibo',
            schedule: function (parser) {
                // parser is a later.parse object
                return parser.text('at ' + config.timerSchedule);
            },
            job: function () {
                Meteor.call('weibo_autoPublish')
            }
        });
    },
    weiboCronStop: function () {
        SyncedCron.remove('weibo')
    },
    weiboCronReset: function () {
        Meteor.call('weiboCronStop')
        Meteor.call('weiboCronStart')
    },
    weibo_authorize: function () {
        this.unblock();
        return HTTP.call('POST', 'https://api.weibo.com/oauth2/authorize', {
            params: {
                client_id: _weibo_app_key,
                redirect_uri: _weibo_app_redirect_url
            }
        })
    },
    weibo_accessToken: function (code) {
        this.unblock();
        var config = WeiboConfig.findOne();
        var res = HTTP.call('POST', 'https://api.weibo.com/oauth2/access_token', {
            params: {
                client_id: _weibo_app_key,
                client_secret: _weibo_app_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: _weibo_app_redirect_url
            }
        })
        var resp = JSON.parse(res.content);
        return WeiboConfig.update(config._id, {
            $set: {
                code: code,
                token: resp.access_token,
                auth_time: new Date(),
                expires_in: resp.expires_in
            }
        })

    },
    weibo_getTokenInfo: function () {
        this.unblock();
        var config = WeiboConfig.findOne();
        return HTTP.call('POST', 'https://api.weibo.com/oauth2/get_token_info', {
            params: {
                access_token: config.token
            }
        })
    },
    weibo_revokeAuth: function () {
        this.unblock();
        var config = WeiboConfig.findOne();
        HTTP.call('POST', 'https://api.weibo.com/oauth2/revokeoauth2', {
            params: {
                access_token: config.token
            }
        })
        return WeiboConfig.update(config._id, { $set: { token: '' } })
    },
    weibo_publish: function (content) {
        this.unblock();
        var config = WeiboConfig.findOne();
        if (!content) content = config.template;
        content = Meteor.call('weibo_analyzeContent', content)
        if (config && !config.token)
            throw new Meteor.Error('微博帐号未授权！')
        else if (content && content.length > 140)
            throw new Meteor.Error('内容不超过140个汉字!')
        else {
            return HTTP.call('POST', 'https://api.weibo.com/2/statuses/update.json', {
                params: {
                    access_token: config.token,
                    status: content
                }
            })
        }
    },
    weibo_autoPublish: function () {
        try {
            Meteor.call('weibo_waitData')
            Meteor.call('weibo_publish')
            WeiboRecord.insert({ status: true })
        } catch (e) {
            WeiboRecord.insert({ status: false, error: JSON.stringify(e) })
        }
    },
    weibo_waitData: function () {
        var config = WeiboConfig.findOne();
        if (config.waitData) {
            var wait = function () {
                var res = false;
                var varList = Meteor.call('weiboVarList');
                varList.forEach(function (e) {
                    if (e.value === null)
                        res = true;
                })
                return res;
            }
            while (wait()) {
                Meteor.sleep(1000 * 60 * 10); //10min
            }
        }
    },
    weibo_saveConfig: function () {


    },
    weibo_analyzeContent: function (content) {
        var varList = Meteor.call('weiboVarList');
        varList.forEach(function (e) {
            content = content.replace(e.name, e.value)
        })
        if (content && content.length > 140)
            throw new Meteor.Error('内容不超过140个汉字!')
        return content;
    },
    weibo_getAppInfo: function () {
        return {
            _weibo_app_key: _weibo_app_key,
            _weibo_app_redirect_url: _weibo_app_redirect_url
        }
    }
});


const _weibo_app_key = '3986222912';
const _weibo_app_secret = '05b6b7cbcd76a22137b41ebf43b14ec3';
const _weibo_app_redirect_url = 'http://106.74.0.132:3000/weibo';



// 用户名：nmgybyj@163.COM
// 密码：ybyj4632119