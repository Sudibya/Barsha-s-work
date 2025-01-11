var express = require("express");
const propertiesController = require("./properties.controller.js");
var router = express.Router();
const { uploadFiles } = require("./properties.service");


router
.get("/get_all_properties", propertiesController.get_all_properties)
.post( "/properties", uploadFiles, propertiesController.validate('properties'), propertiesController.properties)
.post("/delete_property", propertiesController.delete_property)
.post('/getpropertybyid', propertiesController.get_property_by_id)
.get("/get_all_contacts", propertiesController.getAllContacts) 
.post("/add_contact", propertiesController.createContact); 



module.exports = router;
