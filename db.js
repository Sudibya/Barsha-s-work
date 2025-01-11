const db = require("./src/common/db-connection");

db.getConnection((err, connection) => {
  if (err) {
    console.error("Connection test failed:", err.message);
  } else {
    console.log("Connection test successful!");
  }
});
