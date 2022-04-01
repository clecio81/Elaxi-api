 const firebase = require ("firebase-admin")
 
exports.upload = (req, res, next) => {
  
  try {
  
    if (!req.file) {
      console.log("erro")
      console.log(req.body)
      res.status(400).send("Error: No files found");
    } else {
      console.log("foi")
      const blob = req.bucket.file(req.file.originalname);
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });
      blobWriter.on("error", err => {
        console.log(err);
      });
      console.log(blob)
      blobWriter.on("finish", data => {
        const Url = `https://firebasestorage.googleapis.com/v0/b/${
          req.bucket.name
        }/o/${encodeURI(blob.name)}?alt=media`;
        blobWriter.end(req.file.buffer);
        console.log(Url)
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.delete = async (req, res) => {
  console.log("\ncloud-storage.controller(/delete) triggered");

  let filename = "Screenshot_20210706-025916_DuckDuckGo.jpg";
  const storage = req.admin.storage();

  // Deletes the file from the bucket

  await storage

    .bucket("gs://forty-1a729.appspot.com")

    .file(filename)

    .delete()

    .then(() => {
      console.log("SUCCESS");

      console.log(`${filename} deleted successfully`);

      res.status(200);

      res.json("file deleteded successfully");

      return;
    })

    .catch(err => {
      console.log(`${filename} deleted error`);

      res.status(err.code);

      res.json({ msg: err.message });

      return;
    });
};

exports.download = async (req, res) => {
  console.log("\ncloud-storage.controller(/download) triggered");

  let filename = "Screenshot_20210706-025916_DuckDuckGo.jpg";

  const bucketName = "forty-forty-1a729.appspot.com";

  const storage = req.admin.storage();

  storage

    .bucket("gs://forty-1a729.appspot.com")

    .file(filename)

    .getMetadata()

    .then(results => {
      // console.log('Storage Ref ', stringify(results, null, 2));

      const metadata = results[0];

      /*console.log(`File: ${metadata.name}`);

      console.log(`Bucket: ${metadata.bucket}`);

      console.log(`Storage class: ${metadata.storageClass}`);

      console.log(`Self link: ${metadata.selfLink}`);

      console.log(`ID: ${metadata.id}`);

      console.log(`Size: ${metadata.size}`);

      console.log(`Updated: ${metadata.updated}`);

      console.log(`Generation: ${metadata.generation}`);

      console.log(`Metageneration: ${metadata.metageneration}`);

      console.log(`Etag: ${metadata.etag}`);

      console.log(`Owner: ${metadata.owner}`);

      console.log(`Component count: ${metadata.component_count}`);

      console.log(`Crc32c: ${metadata.crc32c}`);

      console.log(`md5Hash: ${metadata.md5Hash}`);

      console.log(`Cache-control: ${metadata.cacheControl}`);

      console.log(`Content-type: ${metadata.contentType}`);

      console.log(`Content-disposition: ${metadata.contentDisposition}`);

      console.log(`Content-encoding: ${metadata.contentEncoding}`);

      console.log(`Content-language: ${metadata.contentLanguage}`);

      console.log(`Metadata: ${metadata.metadata}`);

      console.log(`Media link: ${metadata.mediaLink}`);

      console.log(
        `firebaseStorageDownloadTokens: ${metadata.metadata.firebaseStorageDownloadTokens}`
      );*/

      const img_url = `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${metadata.name}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;

      res.status(200);

      res.json({ downloadUrl: img_url });

      return;
    })

    .catch(err => {
      console.error("ERROR:", err);
    });
};

