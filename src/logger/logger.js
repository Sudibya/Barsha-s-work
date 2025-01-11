const path = require('path')
module.exports = {
    path : process.env.LOG_PATH || path.join('logs')
}