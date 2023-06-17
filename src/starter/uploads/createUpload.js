const config = require("config");
const {ObjectId} = require("mongodb");

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
  const images = DATABASE.collection('photos.files').find({ _id: new ObjectId(requestFileId)});
  const chunks = DATABASE.collection('photos.chunks').find({ files_id: new ObjectId(requestFileId)} );
  let contentType='';
  images
  .toArray()
  .then( data => { 
    if(!data.length){ 
      throw new Error('Image id not found');
    }
    contentType = data[0].contentType;
    return data[0]; 
  })
  .then(data => 
     chunks
     .sort({n:1})
     .toArray())
  .then(ordered => {
    let url = `data:${contentType};base64,`;
    for( const chunk of ordered) { 
      let base64 = chunk.data.toString('base64');
      url += base64;
    }
    return response.status(200).send({url:url});
  })
  .catch(error => {
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
