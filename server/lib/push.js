/**
 * Created by bai on 2015/11/17.
 */

//Push = {}

Push2Android = {
    path: "http://127.0.0.1:8787/MQTT/send_mqtt.php"
}


Push2IOS = {
    //path: 'http://127.0.0.1:8089/',
    options: {
        production: true,

        cert: Meteor.rootPath + '/assets/app/key/cert.pem',
        key: Meteor.rootPath + '/assets/app/key/key.pem',

        "batchFeedback": true,
        "interval": 300
    }
}

apn = Meteor.npmRequire("apn");


