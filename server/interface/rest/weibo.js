
// Api.addRoute('weibo/redirect_uri/', {
//     get: function() {
//         var config = WeiboConfig.findOne();
//         WeiboConfig.update({ _id: config._id }, { $set: this.queryParams })
//         Meteor.call('weibo_accessToken',this.queryParams.code)
//         return '';
//     }
// })

// Api.addRoute('weibo/redirect_uri_cancel', {
//     get: function() {
//         return { err: 'not implement!' }
//     }
// })