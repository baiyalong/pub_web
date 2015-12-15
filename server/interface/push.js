/**
 * Created by bai on 2015/8/21.
 */
//��Ϣ���ͣ��ƶ��ͻ��ˡ�΢�š�΢����

//ios
Push2IOS.send = function (tokens, msg) {
    if (tokens && tokens.length != 0) {
        var connection = new apn.Connection(Push2IOS.options);
        tokens.forEach(function (e) {
            var note = new apn.Notification()
            note.expiry = Math.floor(Date.now() / 1000) + 3600  // Expires 1 hour from now.
            note.badge = 1;
            note.sound = "alert.aiff";
            note.alert = msg;
            note.payload = {'message': msg};
            var device = new apn.Device(e.ID)
            connection.pushNotification(note, device)
        })

        var feedback = new apn.Feedback(Push2IOS.options);
        feedback.on("feedback", function (devices) {
            devices.forEach(function (item) {
                // Do something with item.device and item.time;
                console.log(item)
            });
        });
    }
}


//android

Push2Android.send = function (keys, msg) {
    if (keys && keys.length != 0) {
        keys.forEach(function (e) {
            HTTP.call('POST', Push2Android.path, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                content: "target=tokudu/" + e.ID + "&message=" + msg
            }, function (err, res) {
                if (err)
                    console.log('Push2Android', err, res)
            })
        })
    }
}