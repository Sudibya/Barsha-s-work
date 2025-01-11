var request = require("request");
const log4js = require("log4js");
const logger = log4js.getLogger();
const nodemailer = require("nodemailer");
const helper = require("../common/helper.js");

/* The code is to send an email to the user. */
exports.sendEmail = function (
  subject,
  bodyParams,
  toEmail,
  templateURL,
  fileName,
  fileContent,
  callback
) {
  try {
    var emailBody = "";
    var emailFrom = process.env.SMTP_USER_EMAIL;
    templateContextPath = process.env.CONTEXT_PATH;

   /* console.log(
      "templateContextPath + templateURL,------------>",
      templateContextPath + templateURL
    ); */
    // read HTML template
    request.get(
      templateContextPath + templateURL,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          emailBody = body.toString();
          if (bodyParams.length > 0) {
            var messageResult = bodyParams[0];
            Object.keys(messageResult).forEach(function (key) {
              emailBody = emailBody.replace(
                "{{" + key + "}}",
                messageResult[key]
              );
            });
          }

          const message = {
            from: emailFrom, // Sender address
            to: toEmail, // List of recipients
            subject: subject, // Subject line
            html: emailBody,
          };
         // console.log(message);

          let transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_USER_EMAIL,
              pass: process.env.SMTP_APP_PASSWORD,
            },
          });

          transport.sendMail(message, function (err, info) {
            if (err) {
              console.log(err);
              helper.log("error", err);
              return callback(false);
            } else {
              console.log(info);
              //   helper.log("info", info);
              return callback(info);
            }
          });
        } else {
        //  console.log("error in file reading ---------> " + error);
          helper.log("error", error);
          return callback(error);
        }
      }
    );
  } catch (e) {
    // console.log("e--------------------", e);
    helper.log("error", e);
    return callback(e);
  }
};
