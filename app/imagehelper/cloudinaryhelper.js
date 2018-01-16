var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'kit',
  api_key: '361569255921837',
  api_secret: 'NLdL6ncWMLRIzsvYSOKcQwnyyJU'
});

module.exports.upload = function(imgPath, callback){
  cloudinary.uploader.upload(imgPath, function(result) {
    console.log('Cloudinary photo uploaded result:');
    console.log(result);
    if(result){
      callback(null, result);
    }
    else {
      callback('Error uploading to cloudinary');
    }
  });
};
