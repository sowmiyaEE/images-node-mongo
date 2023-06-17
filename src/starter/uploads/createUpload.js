const config = require("config");
const {ObjectId} = require("mongodb");
var objectId = new ObjectId();

const uploadFile = (request, response) => {
  const file = request.file;
  return response.status(200).send({
    success: true,
    msg: "File uploaded successfully",
    data: {
      id: file.id,
    }
  });
};

const getFile = (request, response) => {
  const requestFileId = request.params.id;
  if(!requestFileId) {
    return response.status(400).send({
      success: false,
      msg: "id param required"
    })
  }
  const images = DATABASE.collection('photos.files');
  const chunks = DATABASE.collection('photos.chunks');
  let contentType='';
  images.find({ _id: new ObjectId(requestFileId)}).toArray().then( data =>
   { 
   if(!data.length){ throw new Error('data not found');}
   contentType = data[0].contentType; return data; }
  ).then(data => 
     chunks.find( {files_id: new ObjectId(data[0]._id)} ).sort({n:1}).toArray())
   .then(ordered => {
    let url = `data:${contentType};base64,`;
    for( const chunk of ordered) { 
      let base64 = chunk.data.toString('base64');
      url += base64;
    }
    return response.status(200).send({url:url});
  }).catch(error => {
   return response.status(400).send({
     success: false,
     msg: error.message
   })
  })
};
module.exports = {
  uploadFile,
  getFile
};
