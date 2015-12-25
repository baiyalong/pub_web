/**
 * Created by bai on 2015/8/20.
 */
$(function () {
    if (location.pathname == '/app')
        $("title").html("内蒙古空气质量指数客户端");
    else
        $("title").html("公共信息发布服务系统");
})