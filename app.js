const express = require("express");
var useragent = require("express-useragent");
const cookieParser = require("cookie-parser");
const log4js = require("log4js");
const morgan = require("./src/logger/morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");
require("./src/logger/log4js");

const viewRoutes = require("./src/routes/view/view.route");
const masterRoutes = require("./src/routes/master/master.route");
const propertiesRoutes = require("./src/routes/properties/properties.route");

app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));
app.use(morgan);
app.use(useragent.express());
app.use(cookieParser());
app.set("trust proxy", true);

// Email templates

//To allow cross-origin requests
app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/public", express.static("public"));

// routes
app.use("/", viewRoutes);
app.use("/api/v1/", masterRoutes);
app.use("/api", propertiesRoutes);



app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
  console.group(`Application Running on : ${process.env.PORT}`);
});
