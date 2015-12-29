/**
 * Created by bai on 2015/8/21.
 */

//���ɻ��������ӿ�


Api.addRoute('cityDetail/:id', {
    get: function () {
        return BLL.www.cityDetail(this.urlParams.id);
    }
})


Api.addRoute('area', {
    get: function () {
        return BLL.www.area();
    }
})

Api.addRoute('airQualityForcast', {
    get: function () {
        return BLL.www.airQualityForcast();
    }
})

Api.addRoute('verifyCode/:connection', {
    get: function () {
        // console.log(this.request.headers)
        // console.log('api verifyCode', this.urlParams.connection)
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/png'
            },
            body: getVerifyCode(this.urlParams.connection)
        };
    }
})