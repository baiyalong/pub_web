/**
 * Created by bai on 2015/8/20.
 */
//����ƽ̨·�
//

Router.configure({
    layoutTemplate: 'emptyLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return [this.subscribe('city')]
    }
});


if (!ENV_INTERFACE) {
    Router.route('/')
    Router.route('/user', {
        waitOn: function() {
            return [this.subscribe('user'), this.subscribe('city'), this.subscribe('warningPassword')]
        }
    });
    Router.route('/login', function() {
        this.layout('emptyLayout')
    });
    Router.route('/ipNotTrust', function() {
        this.layout('emptyLayout')
    });
    Router.route('/app', {
        //waitOn: function () {
        //    return [this.subscribe('mobileApp'), this.subscribe('file')]
        //}
    }, function() {
        this.layout('emptyLayout')
    });

    Router.route('/monitorStation/', function() {
        Router.go('/monitorStation/150100')
    })
    Router.route('/monitorStation/:city', function() {
        this.render('monitorStation', { data: this.params.city })
    }, {
            waitOn: function() {
                return [this.subscribe('county'), this.subscribe('station', this.params.city)]
            }
        })
        ;
    Router.route('/dataCorrection/', function() {
        Router.go('/dataCorrection/150100051/' + new Date().getTime())
    })
    Router.route('/dataCorrection/:stationCode/:date', function() {
        this.render('dataCorrection')
    }, {
            waitOn: function() {
                return [this.subscribe('city'),
                    this.subscribe('station'),
                    this.subscribe('dataStationHourly', this.params.stationCode, this.params.date)
                ]
            },
            data: function() {
                return {
                    stationCode: this.params.stationCode,
                    date: this.params.date
                }
            }
        });
    Router.route('/dataSync/:limit?', {
        name: 'dataSync',
        waitOn: function() {
            var limit = parseInt(this.params.limit) || 20;
            return [this.subscribe('dataStationHourlyReSyncRecord', limit)]
        },
        data: function() {
            var limit = parseInt(this.params.limit) || 20;
            return {
                recordList: DataStationHourlyReSyncRecord.find({}, { sort: { tStart: -1 }, limit: limit }).map(function(e) {
                    return {
                        _id: e._id,
                        date: moment(e.date).format('YYYY-MM-DD'),
                        success: e.success ? '成功' : '失败',
                        tStart: moment(e.tStart).format('YYYY-MM-DD HH:mm:ss'),
                        tEnd: moment(e.tEnd).format('YYYY-MM-DD HH:mm:ss')
                    }
                })
            }
        }
    });
    Router.route('/dataImportExport', {
        waitOn: function() {
            return [this.subscribe('station'), this.subscribe('county')]
        }
    });
    Router.route('/pollutantLimit', {
        waitOn: function() {
            return this.subscribe('limit')
        }
    });
    Router.route('/emergencyWarning', {
        waitOn: function() {
            return [this.subscribe('city'), this.subscribe('warning'), this.subscribe('warningPassword')]
        }
    });
    Router.route('/mobileClient', {
        waitOn: function() {
            return [this.subscribe('mobileApp'), this.subscribe('file')]
        }
    })
    Router.route('/terminalStatus', {
        waitOn: function() {
            return [this.subscribe('terminal'), this.subscribe('city')]
        }
    })
    Router.route('/ipTrustList', {
        waitOn: function() {
            return [this.subscribe('ipTrustList')]
        }
    })
    Router.route('/airQualityReview/:limit?', {
        name:'airQualityReview',
        waitOn: function() {
            var limit = parseInt(this.params.limit) || 50;
            return [this.subscribe('airQuality',limit), this.subscribe('limit')]
        }
    });
    Router.route('/airQualityPublish/:limit?', {
        name:'airQualityPublish',
        waitOn: function() {
            var limit = parseInt(this.params.limit) || 50;
            return [this.subscribe('county'), this.subscribe('airQuality',limit), this.subscribe('dataAirQuality'), this.subscribe('limit')]
        }
    });

    Router.onBeforeAction(function(req, res, next) {
        if (this.url == '/app') {
            this.layout("emptyLayout");
            this.render('app');
        }
        /*
            var self = this;
            Meteor.call('checkIP', function (err, trust) {
                if (err) console.log(err)
                else if (!trust) {
                    self.layout("emptyLayout");
                    self.render('ipNotTrust');
                }
            })
        */
        if (!Meteor.userId() || this.url == '/login') {
            this.layout("emptyLayout");
            this.render('login');
        } else {
            this.layout("layout");

            // console.log(this, req, res, next)
            if (Roles.userIsInRole(Meteor.userId(), 'admin') && ['/'].indexOf(req.url) != -1) Router.go('/user');
            if (Roles.userIsInRole(Meteor.userId(), 'audit') && ['/airQualityReview'].indexOf(req.url) == -1) Router.go('/airQualityReview');
            if (!Roles.userIsInRole(Meteor.userId(), 'admin') && !Roles.userIsInRole(Meteor.userId(), 'audit') && ['/airQualityPublish'].indexOf(req.url) == -1) Router.go('/airQualityPublish');
            this.next();
        }
    });


} else {
    Router.route('/', function() { Router.go('/app') })
    Router.route('/app')
}
