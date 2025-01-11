require("dotenv").config();
var mysql = require("mysql2");

exports.getConnection = function (callback) {
  var pool = mysql.createPool({
    connectionLimit: 1000, //important
    // acquireTimeout: 20000,
    //Change following values only base mysql timings
    // Run the following to know the timings
    // SELECT @@global.wait_timeout, @@session.wait_timeout, @@global.interactive_timeout, @@session.interactive_timeout
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 28800,
    // acquireTimeout: 28800,
    // timeout: 28800,
    host: process.env.DB_HOST,
    // localAddress: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    debug: false,
    multipleStatements: true,
   // timezone: '+01:00'
  });

  pool.getConnection(function (err, connection) {
    //console.log(err, "connection");
    callback(err, connection);
  });
};
