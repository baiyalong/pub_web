/**
 * Created by bai on 2015/11/24.
 */


menu = [
    {
        path: '/user',
        name: '用户权限管理',
        imgSrc: '/yonghuquanxianguanli.png',
        role: 'admin',
        //hide: true
    }, {
        path: '/dataImportExport',
        name: '数据导入导出',
        imgSrc: '/shujudaorudaochu.png',
        role: 'admin',
        //hide: true
    }, {
        path: '/monitorStation',
        name: '发布点位管理',
        iconClass: 'layout layout_5',
        role: 'admin'
    }, {
        path: '/dataCorrection',
        name: '发布内容手动校核',
        iconClass: 'layout layout_7',
        role: 'admin'
    }, {
        path: '/dataSync',
        name: '手动重新数据同步',
        iconClass: 'layout layout_4',
        role: 'admin'
    }, {
        path: '/pollutantLimit',
        name: '设定污染物排放限值',
        iconClass: 'layout layout_6',
        role: 'admin'
    }, {
        path: '/emergencyWarning',
        name: '紧急污染预告推送',
        iconClass: 'layout layout_3',
        role: 'admin'
    }, {
        path: '/mobileClient',
        name: '移动客户端版本管理',
        iconClass: 'layout layout_2',
        role: 'admin'
    }, {
        path: '/terminalStatus',
        name: '移动终端状态管理',
        iconClass: 'layout layout_6',
        role: 'admin',
        hide:true
    }, {
        path: '/ipTrustList',
        name: 'IP地址信任列表',
        iconClass: 'layout layout_1',
        role: 'admin'
    }, {
        path: '/airQualityReview',
        name: '空气质量预报审核',
        imgSrc: '/yubaosh.png',
        role: ['admin', 'audit']
    }, {
        path: '/airQualityPublish',
        name: '空气质量预报发布',
        imgSrc: '/yubaosh.png',
        role: 'publish'
    },{
        path: '/weibo',
        name: '微博发布管理',
        imgSrc: '/yubaosh.png',
        role: 'admin'
    },
]
