const express = require("express");
const firebase = require("firebase");
const functions = require("firebase-functions");
const upload = require("./router/firebase/upload.js");
const sessions = require("./router/firebase/session.js");
//const dog_random_img = require("./router/firebase/dog_random_img.js");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const Multer = require("multer");
const session = require("express-session");
const passport = require("./passport");
var firebaseConfig = {
  apiKey: "AIzaSyA0iFzg9Y2dqSVg7j95ykLtWJkrd2_qu3M",
  authDomain: "forty-1a729.firebaseapp.com",
  databaseURL: "https://forty-1a729-default-rtdb.firebaseio.com",
  projectId: "forty-1a729",
  storageBucket: "forty-1a729.appspot.com",
  messagingSenderId: "1003613086805",
  appId: "1:1003613086805:web:74aedfe9949ac4acad60dc",
  measurementId: "G-RSQJRKH7S1"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const app = express();

app.use(
  session({
    secret: "session-secret",

    resave: "false",

    saveUninitialized: "true"
  })
);

app.use(express.static(__dirname));
app.use(passport.initialize());

app.use(passport.session());
app.get(
  "/auth/firebase",

  passport.authenticate("firebaseauth", {})
);

app.get(
  "/auth/firebase/callback",

  passport.authenticate("firebaseauth", { failureRedirect: "/" }),

  function(req, res) {
    // Successful authentication, redirect home.

    res.redirect("/home");
  }
);

app.get("/logout", function(req, res) {
  req.logout();

  req.session.destroy(function(err) {
    req.user = null;

    res.redirect("/");
  });
});
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use("/css", express.static(__dirname + "views/css"));
app.use("/js", express.static(__dirname + "views/js"));
app.use(bodyParser.json());
app.locals.db = firebase.firestore();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.get("/", async (req, res) => {
  /*const criar = firebase.firestore().collection("users");

  criar.doc("123456789").set({
    imgs_name: "req.file.originalname",

    imgs_url: "Url"
  });*/

  var snapshot = await firebase
    .firestore()
    .collection("users")
    .get();
  let gg = snapshot.docs.map(doc => doc.data());

  for (let i = 0; i < gg.length; i++) {
    console.log(gg[i]);
  }

  res.render("server.ejs");
});
app.get("/home", (req, res) => {
  var person = req.query;
  res.render("index.ejs", { person });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {
    user: firebase.auth().currentUser
  });
});

app.get("/config/:id", (req, res) => {
  try {
    const user = firebase.auth().currentUser;

    if (!user) {
      res.redirect("/login");
    } else if (user.uid != req.params.id) {
      res.redirect(`/config/${user.uid}`);
    } else {
      res.render("config.ejs", {
        user: user.uid,
        msg_err: null
      });
    }
  } catch (e) {
    console.log(e);
  }
});
app.get("/chat", (req, res) => {
  /*if(!req.isAuthenticated()){
      }else{
      }

*/
  app.locals.user = firebase.auth().currentUser;
  const user = firebase.auth().currentUser;

  if (user) {
  } else {
  }

  res.render("chat.ejs", {
    user: user || "&&"
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", {
    user: firebase.auth().currentUser
  });
});

app.get("/users/:g", async (req, res) => {
  const citiesRef = db.collection("users");
  const snapshot = await citiesRef.where("id", "==", req.params.g).get();
  if (snapshot.empty) {
    res.status(404).send("No matching documents.");
    return;
  }

  snapshot.forEach(doc => {
    res.status(200).json(doc.data());
  });
});

app.get("/profile", async (req, res) => {
  const user_info = {
    des: "hi"
  };

  res.render("profile.ejs", {
    users: null
  });
});

//router
app.use("/api/database/upload", upload);

app.use("/api/database/session", sessions);
const port = process.env.PORT || 3003;

app.listen(port, () => console.log("listening"));
