const log4js = require("log4js");
const { path } = require("./logger");
log4js.configure({
    appenders: {
        everything: { type: 'dateFile', filename: `${path}/app.log` }
    },
    categories: { default: { appenders: ["everything"], level: "debug" } }
});
