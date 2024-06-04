const cloudinary = require('cloudinary').v2;

const deleteFile = async (url) => {
     const imgSplited = url.split("/");
     const folderName = imgSplited.at(-2);
     const fieldName = imgSplited.at(-1).split(".")[0];

     const public_id = `${folderName}/${fieldName}`;

     await cloudinary.uploader.destroy(public_id, () => {
          console.log("Imagen eliminada");
     })
};

module.exports = { deleteFile };