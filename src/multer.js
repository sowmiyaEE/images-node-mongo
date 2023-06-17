const config = require("config");
const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
let uploadToFolder;
const storage = new GridFsStorage({ 
  url: config.get('URL'),
  file: (req, file) => {
    return {
      bucketName: 'photos',
      filename: file.originalname.split(" ").join("")
    };
    }
  });
  uploadToFolder = multer({storage: storage});
module.exports= {uploadToFolder};
