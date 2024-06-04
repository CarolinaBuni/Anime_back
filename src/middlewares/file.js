const multer = require('multer');
const { CloudinaryStorage } = require( 'multer-storage-cloudinary' );
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
          folder: "animes",
          allowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"]
     }
});

const upload = multer({ storage });
module.exports = upload;