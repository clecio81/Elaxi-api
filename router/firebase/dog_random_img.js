const express = require("express");

const router = express.Router();
;
const firebase = require("firebase-admin");




router.get("/dog_random_img/:token", async(req, res) => {
  res.setHeader('Acces-Control-Allow-Origin', 'https://elaxi-api.web.app')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  console.warn(`⚠️ Elaxi API requested!\n- URL: https://elaxi-api.web.app/api/dog_random_img/${req.params.token}\n- STATUS-CODE: ${res.status}`)
  
 
  if(req.params.token === "q"){
    res.send("gsnq")
    }else{
 var snapshot = await firebase
    .firestore()
    .collection("dog_random_img")
    .get();
  let gg = snapshot.docs.map(doc => doc.data());

  for (let i = 0; i < gg.length; i++) {
    res.send(gg[i]);
  }
      }
  })
module.exports = router;

