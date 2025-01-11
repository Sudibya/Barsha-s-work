require("dotenv").config();
var CryptoJS = require("crypto-js");
const log4js = require("log4js");
const db = require("./db-connection");
const moment = require("moment/moment");

const logger = log4js.getLogger();

module.exports.encrypt = (str) => {
  var ciphertext = CryptoJS.AES.encrypt(str, process.env.SECRET_KEY).toString();
  return ciphertext.replaceAll('/','SLASH');
};

module.exports.decrypt = (ciphertext) => {
  var bytes  = CryptoJS.AES.decrypt(ciphertext.toString().replaceAll('SLASH', '/' ), process.env.SECRET_KEY);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports.log = function (type, message, next) {
  logger.log(type, message, moment().format("YYYY-MM-DD HH:mm:ss"));
};
