VerifyCode = {}
VerifyCode.Dict = {}

VerifyCode.getVerifyCode = function (connection) {
    var rand = parseInt(Math.random() * 9000 + 1000)
    if (VerifyCode.Dict[connection]) {
        if (VerifyCode.Dict[connection].length >= 2) VerifyCode.Dict[connection].shift()
        VerifyCode.Dict[connection].push(rand)
    } else {
        VerifyCode.Dict[connection] = [rand];
    }

    Meteor.setTimeout(function () {
        delete VerifyCode.Dict[connection];
    }, 1000 * 60)

    function randColor() {
        return parseInt(255 * Math.random())
    }
    function randAlpha() {
        return parseInt(10 * Math.random()) / 10
    }
    var p = new captchapng(150, 44, rand); // width,height,numeric captcha
    p.color(randColor(), randColor(), randColor(), randColor());  // First color: background (red, green, blue, alpha)
    p.color(randColor(), randColor(), randColor(), randColor()); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');

    // console.log('getVerifyCode', connection, VerifyCode.Dict)
    return imgbase64;
}

VerifyCode.checkVerifyCode = function (connection, code) {
    // console.log('checkVerifyCode', connection, code, VerifyCode.Dict)
    if (VerifyCode.Dict[connection] && VerifyCode.Dict[connection].indexOf(Number(code)) != -1) {
        delete VerifyCode.Dict[connection];
        return true;
    } else return false;
}

Meteor.methods({
    checkVerifyCode: function (code) {
        if (isIntranet(this.connection.clientAddress)) return true;
        else return VerifyCode.checkVerifyCode(this.connection.id, code)
    }
})



function isIntranet(ip) {
    function ipToNumber(ip) {
        var numbers = ip.split(".");
        return parseInt(numbers[0]) * 256 * 256 * 256 +
            parseInt(numbers[1]) * 256 * 256 +
            parseInt(numbers[2]) * 256 +
            parseInt(numbers[3]);
    }
    var num = ipToNumber(ip);
    // function numberToIp(number) {
    //     return (Math.floor(number / (256 * 256 * 256))) + "." +
    //         (Math.floor(number % (256 * 256 * 256) / (256 * 256))) + "." +
    //         (Math.floor(number % (256 * 256) / 256)) + "." +
    //         (Math.floor(number % 256));
    // }
    
    function ipInRange(range) {
        if (range.length == 1) {
            return num == ipToNumber(range[0])
        } else if (range.length == 2) {
            return num >= ipToNumber(range[0]) && num <= ipToNumber(range[1])
        } else return false;
    }


    if (
        ipInRange(['127.0.0.1']) ||
        ipInRange(['10.0.0.0', '10.255.255.255']) ||
        ipInRange(['172.16.0.0', '172.31.255.255']) ||
        ipInRange(['192.168.0.0', '192.168.255.255'])
        ) return true;
    else return false;
}



