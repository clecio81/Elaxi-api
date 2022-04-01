const express = require("express");
const router = express.Router();
const Multer = require("multer");
const admin = require("firebase-admin");
const config = require("./confi/key.js");
const cloudStorageCtrl = require("./confi/coller.js");
const serviceAccount = config.fireBasePrivateKeyPath;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.firebaseStorageBucketURL
});
var bucket = admin.storage().bucket("gs://forty-1a729.appspot.com");
// console.log("ADMIN", admin);
// console.log("BUCKET", bucket);
// var bucket = admin.storage().bucket("my-bucket");
// add admin to ther request params to get into controller zone
router.use(function (req, res, next) {
    if (!req.admin) {
        req.admin = admin;
    }
    if (!req.bucket) {
        req.bucket = bucket;
    }
    next();
});
/*
const upload = Multer({
  
    storage: Multer.memoryStorage() 
});
 *//*
 var upload = Multer({
  startProcessing (req, busboy) {
    if (req.rawBody) { // indicates the request was pre-processed
      busboy.end(req.rawBody)
    } else {
      req.pipe(busboy)
    }
  }
})
router.post('/upload', upload.none(), function (req, res, next) {
  // req.body contains the text fields
console.log(req.body)
})*/
router.post('/upload-avatar', async (req, res) => {
  try{
    if(!req.files) {
           console.log({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // use the name of the input field (i.e. "avatar") 
            // to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            // use the mv() method to place the file in 
            // upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            console.log({
                status: true,
                message: 'File is uploaded'
            });
        }
  }catch(e){
    console.log(e)
  }
  
});

const uploader = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});
router.post("/upload", uploader.single("file"), cloudStorageCtrl.upload);
router.get("/delete", cloudStorageCtrl.delete);
router.get("/download", cloudStorageCtrl.download);

/*

router.post('/upload', upload.single('image'), function (req, res, next) {
  const file = req.file
  const bucket = firebaseAdmin.storage().bucket()
  const fileRef = bucket.file('images/${file.originalName}')
  const stream = fileRef.createWriteStream({
    metadata: {
      contentType : file.mimetype
    }
  })
  stream.on('error', function(error){
    res.render('gallery',{error:'Upload problem'})
  })
  stream.on('finish', function(){
    res.redirect('/gallery')
  })
  stream.end(file.buffer)*/



module.exports = router;