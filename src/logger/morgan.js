const rfs = require('rotating-file-stream') // version 2.x
const morgan = require('morgan')
const path = require('path')
const logPath = require('./logger').path

// create a write stream (in append mode)
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logPath
})
   

// setup the logger
module.exports = morgan('combined', { stream: accessLogStream })
 