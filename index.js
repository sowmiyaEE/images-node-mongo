const config = require("config");
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const {MongoClient} = require("mongodb");
const {uploadToFolder} = require("./src/multer.js");
const client =  new MongoClient(config.get('URL'));
client.connect().then((c) => {
  global.DATABASE = client.db(config.get('DATABASE'));
  global.ObjectId = ObjectId;
  console.log('conencted to database');
})
.catch(err =>{
  console.log(err); 
  throw err;
});
const createUpload = require("./src/starter/uploads/createUpload");
let app = express();
app.use(
  express.urlencoded({extended: true})
);
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.listen(config.get('port'), ()=>{
  console.log("App listening to port:"+config.get('port'));
});
app.post("/images/upload", uploadToFolder.single("file2"), createUpload.uploadFile);
app.get("/image/:id", createUpload.getFile);
