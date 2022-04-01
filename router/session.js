const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
router.get("/user/data", (req, res) => {
  res.send(`this is /api/user/data`)
})
router.post("/register", async (req, res) => {
  // const has = await bcrypt.hash(req.body.password, 10);

  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.senha)
    .then(userCredential => {
      var user = userCredential.user;
      const criar = firebase.firestore().collection("users");
      criar.doc(user.uid).set({
        email: req.body.email,
        nome: req.body.nome,
        id: user.uid
      });
      res.redirect(`/config/${user.uid}`);
    })
    .catch(error => {
      var errorCode = error.code;
      var e = error.message;
      console.log(e);
    });
});

router.post("/login", async (req, res) => {
 console.log("oi")
});
router.post("/config/:id", async (req, res) => {
  try {
    var msg_err = "";

    const user = firebase.auth().currentUser;
    if (!user) msg_err = "Usuário não encontrado";
    user
      .updateProfile({
        displayName: req.body.nome
      })
      .then(() => {
        res.redirect("/chat");
      })
      .catch(e => {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
  }
  res.render("config.ejs", {
    msg_err: msg_err
  });
});
router.get("/config", (req, res) => {
  res.send("&");
});
module.exports = router;
