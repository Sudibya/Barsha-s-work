var express = require("express");
const masterController = require("./master.controller");
var app = express();
var router = express.Router();

router

.get("/country", masterController.country)

.get("/state/:country_id", masterController.state)

.get("/city/:state_id", masterController.city)

.post("/properties", masterController.addProperty) 

.get("/properties", masterController.getAllProperties) 

.get("/properties/:id", masterController.getPropertyById)

module.exports = router;