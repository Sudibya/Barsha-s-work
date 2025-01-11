const db = require("../../common/db-connection");
const log4js = require("log4js");
const logger = log4js.getLogger();
const helper = require("../../common/helper");
const constantResponses = require("../../common/constantMessages.json");


module.exports = {

    executeQuery(query) {
        return new Promise(async (resolve, reject) => {
          try {
            db.getConnection(function (fail, connection) {
              if (!fail) {
                connection.query(query, function (error, result, fields) {
                  connection.release();
                  connection.close();
                  if (error) {
                    helper.log(
                      "error",
                      " :: projects.service.js : updateProjectDetails :: <Exception occured Please reach Admin> :: " +
                        error.message
                    );
                    return reject({
                      success: false,
                      message: "Something went wrong",
                    });
                  }
                  resolve({
                    status: 200,
                    success: true,
                    message: "Data fetched successfully",
                    data: result,
                  });
                });
              } else {
                reject({ success: false, message: "Error in connection." });
              }
            });
          } catch (err) {
            logger.error(err);
            return reject(err);
          }
        });
      },

      async checkDuplicateCity(name,req) {
        try {
          var state_id = helper.decrypt(req.body.state_id);
          return await new Promise((resolve, reject) => {
            db.getConnection(function (fail, connection) {
              if (!fail) {
                connection.query(
                  `select id from city where name = "${name}" and state = ${state_id} limit 1`,
                  (error, results) => {
                    connection.release();
                    connection.close();
                    if (error){
                      reject(error);
                    } else {
                      if(results.length > 0){
                        resolve(true);
                      }else{
                        resolve(false);
                      }
                    }
                  }
                );
              } else {
                reject({ success: false, message: "Error in connection." });
              }
            });
          });
        } catch (error_1) {
          logger.error(error_1);
        }
      },

}