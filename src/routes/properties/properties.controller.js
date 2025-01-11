const { body, validationResult } = require("express-validator");
const masterService = require("../master/master.service");
const log4js = require("log4js");
const logger = log4js.getLogger();
const helper = require("../../common/helper");
const constantResponses = require("../../common/constantMessages.json");
const { uploadFiles, processUploadedFiles } = require("./properties.service");
const propertiesServices = require("./properties.service");


module.exports = {
  validate: (method) => {
    if (method === "properties") {
      return [
        body("id", "Id is required").exists(),
        body("property_name", "Property name is required").exists().custom(async (value, { req }) => {
          const propertyId = req.body.id;
          const isDuplicate =  propertiesServices.checkDuplicate(value, propertyId);
          if (isDuplicate) {
            throw new Error("Property name already exists.");
          }
          return true;
        })
      ];
    }else if(method === "createContact"){
      return [
        body("first_name", "First name is required").exists().notEmpty(),
        body("email", "Valid email is required").exists().isEmail(),
        body("phone", "Phone number should be valid").exists().notEmpty().isLength({ min: 10, max: 15 }),
    ];
    }
    return [];
  },

  get_all_properties: async (req, res) => {
   
    try {
        const query = `
            SELECT 
                id,
                property_name,
                short_description,
                city,
                image_url,
                alt_text,
                redirect_url,
                brochure_url,
                amenities,
                location_and_cities,
                prominent_landmarks,
                unit_plans,
                created_at,
                updated_at
            FROM properties
            WHERE is_active = 1
            ORDER BY created_at DESC
        `;

        const data = await masterService.executeQuery(query);

        // Encrypt the `id` field for each property
        const encryptedData = data.data.map((property) => ({
            ...property,
            id: helper.encrypt(property.id.toString()), // Encrypt the `id`
        }));

        return res.status(200).json({
            message: "Properties retrieved successfully",
            data: encryptedData,
        });
    } catch (err) {
        logger.error("Error in get_all_properties:", err.message);
        return res.status(500).json({ message: "An error occurred while fetching properties." });
    }
},

properties: async (req, res) => {

  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  try {
    console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);
    
      const id = req.body.id == 0 ? 0 : helper.decrypt(req.body.id);
      const {
          property_name,
          short_description,
          city,
          alt_text ,
          redirect_url,
          amenities ,
          location_and_cities ,
          prominent_landmarks ,
          unit_plans ,
      } = req.body;

      const { imageUrl, brochureUrl } = processUploadedFiles(req.files, property_name);//Changed

      
      const isInsert = id === 0;
      const query = isInsert
          ? `
              INSERT INTO properties 
                  (property_name, short_description, city, alt_text, redirect_url, amenities, location_and_cities, prominent_landmarks, unit_plans, image_url, brochure_url)
              VALUES 
                  ("${property_name}", "${short_description}", "${city}", 
                   "${alt_text}", "${redirect_url}", "${amenities}", 
                   "${location_and_cities}", "${prominent_landmarks}", "${unit_plans}",
                   "${imageUrl || null}", "${brochureUrl || null}")
          `
          : `
              UPDATE properties
              SET
                  property_name = "${property_name}",
                  short_description = "${short_description}",
                  city = "${city}",
                  alt_text = "${alt_text}",
                  redirect_url = "${redirect_url}",
                  amenities = "${amenities}",
                  location_and_cities = "${location_and_cities}",
                  prominent_landmarks = "${prominent_landmarks}",
                  unit_plans = "${unit_plans}",
                  image_url = "${imageUrl || null}",
                  brochure_url = "${brochureUrl || null}"
              WHERE id = ${id}
          `;

      const data = await masterService.executeQuery(query);

      if (!data || (!isInsert && data.affectedRows === 0)) {
          return res.status(404).json({ message: "Property not found or failed to update." });
      }

      const message = isInsert ? "Property inserted successfully." : "Property updated successfully.";
      return res.status(200).json({ message });
  } catch (err) {
    console.error("Error:", err.message);
      return res.status(500).json({ message: "An error occurred while processing the property." });
  }
},
delete_property: async (req, res) => {
  try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "Property ID is required" });

      const decryptedId = helper.decrypt(id.toString());
      const query = `
          UPDATE properties
          SET is_active = 0
          WHERE id = ${decryptedId}
      `;

      const data = await masterService.executeQuery(query);

      return data.affectedRows === 0
          ? res.status(404).json({ message: "Property not found or already inactive." })
          : res.status(200).json({ message: "Property marked as inactive successfully." });
  } catch (err) {
      logger.error("Error in delete_property:", err.message);
      return res.status(500).json({ message: "An error occurred while processing the request." });
  }
},
get_property_by_id: async (req, res) => {
  try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "Property ID is required" });

      const decryptedId = helper.decrypt(id.toString());
      const query = `
          SELECT 
              id,
              property_name,
              short_description,
              city,
              image_url,
              alt_text,
              redirect_url,
              brochure_url,
              amenities,
              location_and_cities,
              prominent_landmarks,
              unit_plans,
              created_at,
              updated_at
          FROM properties
          WHERE id = ${decryptedId}
      `;

      const data = await masterService.executeQuery(query);
      if (!data?.data?.length) return res.status(404).json({ message: "Property not found" });

      const property = data.data[0];
      property.id = helper.encrypt(property.id.toString());
      return res.status(200).json({ message: "Property retrieved successfully", data: property });
  } catch (err) {
      logger.error("Error in get_property_by_id:", err.message);
      return res.status(500).json({ message: "An error occurred while fetching the property." });
  }
},

// Contact Details

createContact: async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  const { first_name, email, phone = null, message = null } = req.body;

  try {
      const query = `
          INSERT INTO contact_details (first_name, email, phone, message)
          VALUES ("${first_name}", "${email}", "${phone || 'NULL'}", "${message || 'NULL'}")
      `;
      const data = await masterService.executeQuery(query);

      return res.status(200).json({
          message: "Contact details added successfully",
          contact_id: data.insertId,
      });
  } catch (err) {
      return res.status(500).json({ message: "An error occurred while adding contact details" });
  }
},


getAllContacts: async (req, res) => {
  try {
      const query = `
          SELECT id, first_name, email, phone, message, created_at
          FROM contact_details
          ORDER BY created_at DESC
      `;
      const data = await masterService.executeQuery(query);

      return !data.data || data.data.length === 0
          ? res.status(404).json({ message: "No contact details found" })
          : res.status(200).json({
                message: "Contact details retrieved successfully",
                data: data.data.map((contact) => ({
                    ...contact,
                    id: helper.encrypt(contact.id.toString()),
                })),
            });
  } catch (err) {
      return res.status(500).json({ message: "An error occurred while fetching contact details" });
  }
}


  
};
