const express = require("express");
const router = express.Router();
const axios = require ("axios")
const  firebase = require("firebase-admin");
const { initializeApp, db} = require ("firebase/app")
const cookies = require('cookie-getter');
const autorizado = require ("../../middleware/autorizado.js")
const crypto = require("crypto")

const firebaseConfig = {
  apiKey: "AIzaSyA0iFzg9Y2dqSVg7j95ykLtWJkrd2_qu3M",
  authDomain: "forty-1a729.firebaseapp.com",
  databaseURL: "https://forty-1a729-default-rtdb.firebaseio.com",
  projectId: "forty-1a729",
  storageBucket: "forty-1a729.appspot.com",
  messagingSenderId: "1003613086805",
  appId: "1:1003613086805:web:74aedfe9949ac4acad60dc",
  measurementId: "G-RSQJRKH7S1"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
 const { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} = require ("firebase/auth")

const getauth =  getAuth()
router.use(attachCsrfToken('/', 'csrfToken', (Math.random()* 100000000000000000).toString()));
/**
 * Attaches a CSRF token to the request.
 * @param {string} url The URL to check.
 * @param {string} cookie The CSRF token name.
 * @param {string} value The CSRF token value to save.
 * @return {function} The middleware function to run.
 */
function attachCsrfToken(url, cookie, value) {
  return function(req, res, next) {
    if (req.url == url) {
      res.cookie(cookie, value);
    }
    next();
  }
}
/**
 * @param {string} name The cookie name.
 * @return {?string} The corresponding cookie value to lookup.
 */

router.get("/register#",async (req, res) =>{
  res.send("&&")
})
router.post("/register", async (req, res) => {
  // const has = await bcrypt.hash(req.body.password, 10);
console.warn(`⚠️ Elaxi API requested!\n- URL: https://elaxi-api.web.app/api/database/session/register/\n- STATUS-CODE: ${res.statusCode}`)

  
   var no_photo = "https://firebasestorage.googleapis.com/v0/b/elaxi-api.appspot.com/o/users-photo%2Fno-photo%2Fuser.png?alt=media&token=46c8c92e-c6eb-46c8-b3a6-8438a9686add"
   const id = crypto.randomBytes(16).toString("hex");
  firebase.auth().createUser(
      {
        uid:id,
         email: req.body.email,
         emailVerified: false,
         password: req.body.senha,
         photoURL: no_photo,
         disabled: false
        }
         ).then((
         ) => {
      
      res.redirect(`/config/${id}`);
    })

});


router.post("/login", async (req, res) => {
  console.log("post login")
console.warn(`⚠️ Elaxi API requested!\n- URL: https://elaxi-api.web.app/api/database/session/login\n- STATUS-CODE: ${res.statusCode}`)
  ///firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
try{
// When the user signs in with email and password.
await signInWithEmailAndPassword(getauth, req.body.email, req.body.senha).then((userCredential) => {
    
  })

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
      res.redirect(`/config/${uid}`);

 } else {
    console.log("123")
}
})
}catch(e){
  console.log(e)
}

});
router.get("/sessionLogin", (req, res) => {
  
const auth = getAuth();
onAuthStateChanged(auth, (user) => {

    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
res.send(uid)
  })

});

router.post('/sessionLogin', (req, res) => {
  console.log("post session")
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken
  const csrfToken = req.body.csrfToken
  // Guard against CSRF attacks.
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  firebase.auth().createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );
});
router.post("/config/:id", autorizado.verifyId, autorizado.login, async (req, res) => {
  console.warn(`⚠️ Elaxi API requested!\n- URL: https://elaxi-api.web.app/api/config/${req.params.id}\n- STATUS-CODE: ${res.status}`)
  
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

