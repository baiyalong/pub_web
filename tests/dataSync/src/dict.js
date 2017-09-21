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
    'I': {
        name: '优',
        value: '一级'
    },
    'II': {
        name: '良',
        value: '二级'
    },
    'III': {
        name: '轻度污染',
        value: '三级'
    },
    'IV': {
        name: '中度污染',
        value: '四级'
    },
    'V': {
        name: '重度污染',
        value: '五级'
    },
    'VI': {
        name: '严重污染',
        value: '六级'
    },
}