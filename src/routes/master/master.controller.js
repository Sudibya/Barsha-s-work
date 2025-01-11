const { body, validationResult } = require("express-validator");
const masterService = require("./master.service");
const url = require("url");
const log4js = require("log4js");
const logger = log4js.getLogger();
const helper = require("../../common/helper");
const constantResponses = require("../../common/constantMessages.json");

module.exports = {
  country: async (req, res) => {
    try {
      var query = `select id,name,short_name,currency from country where is_active = 1`;
      const countryData = await masterService.getData(query);
      for (const file of countryData.data) {
        file.id = await helper.encrypt(file.id.toString());
      }
      res.json(countryData);
    } catch (e) {
      helper.log(
        "error",
        " :: masterController : updateFaq :: <Exception occurred. Please reach Admin> :: " +
          e.message
      );
      res.status(500).send(constantResponses.exceptionOccuredResponse);
    }
  },

  state: async (req, res) => {
    try {
      var country_id = req.params.country_id;
      const decryptedId = await helper.decrypt(country_id);
      var query = `select id,name from state where is_active = 1 and country_id = ${decryptedId}`;
      const stateData = await masterService.getData(query);
      for (const file of stateData.data) {
        file.id = await helper.encrypt(file.id.toString());
      }
      res.json(stateData);
    } catch (e) {
      helper.log(
        "error",
        " :: masterController : updateFaq :: <Exception occurred. Please reach Admin> :: " +
          e.message
      );
      res.status(500).send(constantResponses.exceptionOccuredResponse);
    }
  },

  city: async (req, res) => {
    try {
      var state_id = req.params.state_id;
      const decryptedId = await helper.decrypt(state_id);
      var query = `select id,name from city where is_active = 1 and state_id = ${decryptedId}`;
      const cityData = await masterService.getData(query);
      for (const file of cityData.data) {
        file.id = await helper.encrypt(file.id.toString());
      }
      res.json(cityData);
    } catch (e) {
      helper.log(
        "error",
        " :: masterController : updateFaq :: <Exception occurred. Please reach Admin> :: " +
          e.message
      );
      res.status(500).send(constantResponses.exceptionOccuredResponse);
    }
  },
  addProperty: async (req, res) => {
    try {
      const {
        name,
        description,
        locations_cities,
        amenities,
        landmarks,
        unit_plans,
        big_image_url,
        logo_image_url,
      } = req.body;

      const propertyData = {
        name,
        description,
        locations_cities,
        amenities,
        landmarks,
        unit_plans,
        big_image_url,
        logo_image_url,
      };

      const result = await masterService.addProperty(propertyData);
      res.status(201).json({
        message: "Property added successfully",
        propertyId: result.insertId,
      });
    } catch (e) {
      console.log("Error occurred in addProperty:", e.message); // Added log
      helper.log(
        "error",
        " :: propertiesController : addProperty :: <Exception occurred> :: " +
          e.message
      );
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try after sometime", // Custom error message
      });
    }
  },

  getAllProperties: async (req, res) => {
    try {
      const properties = await masterService.getAllProperties();
      res.json(properties);
    } catch (e) {
      console.log("Error occurred in getAllProperties:", e.message); // Added log
      helper.log(
        "error",
        " :: propertiesController : getAllProperties :: <Exception occurred> :: " +
          e.message
      );
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try after sometime", // Custom error message
      });
    }
  },

  getPropertyById: async (req, res) => {
    try {
      const propertyId = req.params.id;
      const decryptedId = await helper.decrypt(propertyId);
      const property = await masterService.getPropertyById(decryptedId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (e) {
      console.log("Error occurred in getPropertyById:", e.message); // Added log
      helper.log(
        "error",
        " :: propertiesController : getPropertyById :: <Exception occurred> :: " +
          e.message
      );
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try after sometime", // Custom error message
      });
    }
  },
};
