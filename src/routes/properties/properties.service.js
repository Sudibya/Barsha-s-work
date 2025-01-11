const db = require("../../common/db-connection");
const log4js = require("log4js");
const logger = log4js.getLogger();
const helper = require("../../common/helper");
const masterService = require("../master/master.service");
const constantResponses = require("../../common/constantMessages.json");
const multer = require('multer');
const path = require('path');

const UPLOAD_PATHS = {
    image_url: path.join(__dirname, '../../../public/images'),
    brochure_url: path.join(__dirname, '../../../public/brochure'),
};

const ALLOWED_FILE_TYPES = {
    image_url: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], // Added 'image/jpg'
    brochure_url: ['application/pdf'],
};

// Configure Multer storage with dynamic destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = UPLOAD_PATHS[file.fieldname];
        if (uploadPath) {
            cb(null, uploadPath); // Save to the respective folder
        } else {
            cb(new Error('Invalid field name'), false);
        }
    },
    filename: (req, file, cb) => {
        const propertyName = req.body.property_name?.replace(/\s+/g, '_').toLowerCase() || 'property';
        const fileExtension = path.extname(file.originalname);
        // Use only the propertyName with the file extension regardless of field name
        const fileName = `${propertyName}${fileExtension}`;
        cb(null, fileName);
    },
    
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ALLOWED_FILE_TYPES[file.fieldname];
    console.log(`Uploaded file fieldname: ${file.fieldname}`);
console.log(`Uploaded file mimetype: ${file.mimetype}`);
    if (allowedTypes && allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}.`), false);
    }
};

// Multer instance with storage and file filter
const upload = multer({
    storage,
    fileFilter,
});

module.exports = {
    // Multer middleware for uploading multiple fields
    uploadFiles: upload.fields([
        { name: 'image_url', maxCount: 1 },
        { name: 'brochure_url', maxCount: 1 },
    ]),

    // Function to handle uploaded files and return their filenames
    processUploadedFiles: (files, propertyName) => {
        if (!files) return { imageUrl: null, brochureUrl: null };
    
        const formattedPropertyName = propertyName.replace(/\s+/g, '_').toLowerCase();
        const getFileName = (file) =>
            file ? `${formattedPropertyName}${path.extname(file.originalname)}` : null;
    
        return {
            imageUrl: getFileName(files.image_url?.[0]),
            brochureUrl: getFileName(files.brochure_url?.[0]),
        };
    },
    checkDuplicate: async (propertyName, propertyId) => {
        const query = `SELECT id FROM properties WHERE property_name = ? ${propertyId && propertyId !== 0 ? 'AND id != ?' : ''}`;
        const params = propertyId && propertyId !== 0 ? [propertyName, propertyId] : [propertyName];
      
        try {
          const existingProperties = await db.query(query, params);
          return existingProperties && existingProperties.length > 0;
        } catch (err) {
          logger.error("Database error during duplicate check:", err);
          // Return a safe default to prevent application crash
          return false;
        }
      },
};
