var moment = require('moment')
exports.now = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')