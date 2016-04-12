
Api.addRoute('weibo/redirect_uri/', {
    get: function() {
        var config = WeiboConfig.findOne();
        WeiboConfig.update({ _id: config._id }, { $set: this.queryParams })
        return null;
    }
})

Api.addRoute('weibo/redirect_uri_cancel', {
    get: function() {
        return { err: 'not implement!' }
    }
})