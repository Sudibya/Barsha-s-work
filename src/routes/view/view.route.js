var express = require("express");
const viewController = require("./view.controller");
var app = express();
var router = express.Router();

router
  .get("/", viewController.home)

  .get("/home", viewController.home)

  .get("/about", viewController.about)

  .get("/services", viewController.services)

  .get("/contact", viewController.contact)

  .get("/terms", viewController.terms)

  .get("/properties", viewController.properties)


  .get("/privacy", viewController.privacy)

  .get('/property_detail/:id', viewController.properties_detail)


module.exports = router;
