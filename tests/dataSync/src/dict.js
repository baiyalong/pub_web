var src_query = require('./mysql').query
var stations = {}

exports.init = c => {
    src_query(`select uniquecode,stationcode from PublishStationConfig;`, (err, res) => {
        if (!err) {
            console.log('dict init')
            res.forEach(e => stations[e.stationcode] = e.uniquecode)
        }
        c(err)
    })
}

exports.stations = () => stations

exports.levels = {
    '—': {
        name: '—',
        value: '—'
    },
    'Ⅰ': {
        name: '优',
        value: '一级'
    },
    'Ⅱ': {
        name: '良',
        value: '二级'
    },
    'Ⅲ': {
        name: '轻度污染',
        value: '三级'
    },
    'Ⅳ': {
        name: '中度污染',
        value: '四级'
    },
    'Ⅴ': {
        name: '重度污染',
        value: '五级'
    },
    'Ⅵ': {
        name: '严重污染',
        value: '六级'
    },
}