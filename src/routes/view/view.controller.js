const { body, validationResult } = require("express-validator");
const viewService = require("./view.service");
const url = require("url");
const log4js = require("log4js");
const logger = log4js.getLogger();
const helper = require("../../common/helper");

const metaData = {
  title: "Samprapthi",
  description: "Samprapthi",
  keywords: "Samprapthi",
};

module.exports = {
  home: async (req, res) => {
    res.render("pages/home", {
      metaData: metaData,
    });
  },

  properties: async (req, res) => {
    res.render("pages/properties", {
      metaData: metaData,
    });
  },

  services: async (req, res) => {
    res.render("pages/services", {
      metaData: metaData,
    });
  },

  contact: async (req, res) => {
    res.render("pages/contact", {
      metaData: metaData,
    });
  },

  about: async (req, res) => {
    res.render("pages/about", {
      metaData: metaData,
    });
  },

  terms: async (req, res) => {
    res.render("pages/terms", {
      metaData: metaData,
    });
  },

  privacy: async (req, res) => {
    res.render("pages/privacy", {
      metaData: metaData,
    });
  },
  properties_detail: async (req, res) => {
    res.render('pages/properties_detail', { metaData: metaData, propertyId: req.params.id });
  },

};
