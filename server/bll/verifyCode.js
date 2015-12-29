VerifyCodeDict = {}

getVerifyCode = function (connection) {
    var rand = parseInt(Math.random() * 9000 + 1000)
    VerifyCodeDict[connection] = rand;
    Meteor.setTimeout(function () {
        delete VerifyCodeDict[connection];
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

// console.log('getVerifyCode',connection,VerifyCodeDict)
    return imgbase64;
}

Meteor.methods({
    checkVerifyCode: function (connection, code) {
        // console.log('checkVerifyCode',connection,code,VerifyCodeDict)
        if (VerifyCodeDict[connection] == code) {
            delete VerifyCodeDict[connection];
            return true;
        } else return false;
    }
})