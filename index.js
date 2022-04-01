const express = require("express");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const upload = require("./router/firebase/upload.js");
const sessions = require("./router/firebase/session.js");
const Multer = require("multer");
const { onAuthStateChanged, firebase, getAuth, sendPasswordResetEmail} = require("firebase/auth")
const bodyParser = require("body-parser");
const ejs = require ("ejs")
//usuário
const autorizado = require("./middleware/autorizado.js");

//routers
const dog_random_img = require("./router/firebase/dog_random_img.js");
const app = express();


var db = admin.firestore();
// b1e5413 (update auth v9)
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use("/css", express.static(__dirname + "views/css"));
app.use("/js", express.static(__dirname + "views/js"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

exports.app = functions.https.onRequest(app);
app.get("/atlassian-domain-verification.html", async (req, res) =>{
  res.render("atlassian-domain-verification.ejs")
});
app.get("/logout", function(req, res) {
  req.logout();

  req.session.destroy(function(err) {
    req.user = null;

    res.redirect("/");
  });
});
app.get("/", async (req, res) => {
  res.render("server.ejs");
});
app.get("/home", (req, res) => {
  var person = req.query;
  res.render("index.ejs", { person });
});

app.get("/login", (req, res) => {
  console.log("oi cliente")
  res.render("login.ejs", {
    user: admin.auth().currentUser
  });
});

app.get("/grupo", (req, res) => {
  
  res.render("grupo.ejs", {
  });
});
app.get("/dograndom", (req, res) => {
  const paragrafo ={
    "textos":"ianshsuisbs",
    "textos":"kwoqhana"
  }
  const imagem =  "https://firebasestorage.googleapis.com/v0/b/forty-1a729.appspot.com/o/nodejs-api-rest-padronizada-escalavel.png?alt=media&token=f0052dee-4f09-42c9-9a5d-5c53deddec17"
  res.render("dograndom.ejs", {
    principal:"principal",
    subtitulo:"subtítulo",
    titulo:"titulo",
    meta_titulo:"dograndom",
    botao_texto:"Gerar key",
    paragrafo:"lausnduauabd jaiaha <strong> gusjs </strong> jsjabba",
  imagem:imagem
  });

});
app.get("/config/:id", autorizado.verifyId, autorizado.login, (req, res) => {
  try {
    const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  
      res.render("config.ejs", {
        user: user.uid,
        msg_err: null
      });
})
    
  } catch (e) {
    console.log(e);
  }
});
app.get("/_/auth/action", autorizado.login, (req, res) => {
  res.send("ola")
})
app.get("/chat", autorizado.login,  (req, res) => {
  /*if(!req.isAuthenticated()){
      }else{
      }
*/const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  
  res.render("chat.ejs", {
    user: user || "&&"
  });
})
});
app.get("/sendPasswordReset", (req, res) =>{
  try{
    
    const auth = getAuth();
var emailAddress = "clecios088@gmail.com"
  sendPasswordResetEmail(auth, emailAddress)
.then(function() {  
res.send("ok")
})
.catch(function(error) {
console.log(error)
});
}catch(e){
  console.error(e)
}


})

app.get("/register", (req, res) => {
  res.render("register.ejs", {
    user: admin.auth().currentUser
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

app.get("/avatar", async (req, res) => {
  const user_info = {
    des: "hi"
  };
 
  res.render("avatar.ejs", {
    users: null
  });
});


app.get("/api", async(req, res) =>{ 
  res.send("ok")
  })
app.use("/api/", dog_random_img);
//router

app.use("/api/database/upload", upload);
app.use("/api/database/session", sessions);

    

app.get("/logout", function(req, res) {
  req.logout();

  req.session.destroy(function(err) {
    req.user = null;

    res.redirect("/");
  });
});
app.get("pegar-ip",async (req, res) =>{
  res.send(req.socket.remoteAddress)
  app.locals.ip = req.socket.remoteAddress
})
app.get("bloquear-ip",async(req, res) =>{
  var blackList = app.locals.remoteAddress

var ip = req.ip 
            || req.connection.remoteAddress 
            || req.socket.remoteAddress 
            || req.connection.socket.remoteAddress;

    if(blackList.indexOf(ip) > -1)
    {
        res.end()
}
})
app.get("/", async (req, res) => {
  res.render("server.ejs");
});
app.get("/home", (req, res) => {
  var person = req.query;
  res.render("index.ejs", { person });
});

app.get("/login", (req, res) => {
  console.log("oi cliente")
  res.render("login.ejs", {
    user: admin.auth().currentUser
  });
});

app.get("/grupo", (req, res) => {
  
  res.render("grupo.ejs", {
  });
});
app.get("/dograndom", (req, res) => {
  const paragrafo ={
    "textos":"ianshsuisbs",
    "textos":"kwoqhana"
  }
  const imagem =  "https://firebasestorage.googleapis.com/v0/b/forty-1a729.appspot.com/o/nodejs-api-rest-padronizada-escalavel.png?alt=media&token=f0052dee-4f09-42c9-9a5d-5c53deddec17"
  res.render("dograndom.ejs", {
    principal:"principal",
    subtitulo:"subtítulo",
    titulo:"titulo",
    meta_titulo:"dograndom",
    botao_texto:"Gerar key",
    paragrafo:"lausnduauabd jaiaha <strong> gusjs </strong> jsjabba",
  imagem:imagem
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

  app.locals.user = dograndom.auth().currentUser;
  const user = admin.auth().currentUser;

  if (user) {
  } else {
  }

  res.render("chat.ejs", {
    user: user || "&&"
  });
});
app.get("/sendPasswordReset", (req, res) =>{
  try{
    var password = '123456789'
    var email = "clecio1084@gmail.com"
firebase.auth()
    .getUserByEmail(email)
  .then((user) => {
    // Confirm user is verified.
    if (user.emailVerified) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      return getAuth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.send(error)
  });

}catch(e){
  console.error(e)
}


})

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

app.get("/avatar", async (req, res) => {
  const user_info = {
    des: "hi"
  };
 
  res.render("avatar.ejs", {
    users: null
  });
});


app.get("/api", async(req, res) =>{ 
  res.send("ok")
  })
app.use("/api/", dog_random_img);
//router

app.use("/api/database/upload", upload);
app.use("/api/database/session", sessions);

    

app.get("/logout", function(req, res) {
  req.logout();

  req.session.destroy(function(err) {
    req.user = null;

    res.redirect("/");
  });
});
app.get("/", async (req, res) => {
  res.render("server.ejs");
});
app.get("/home", (req, res) => {
  var person = req.query;
  res.render("index.ejs", { person });
});

app.get("/login", (req, res) => {
  console.log("oi cliente")
  res.render("login.ejs", {
    user: admin.auth().currentUser
  });
});

app.get("/grupo", (req, res) => {
  
  res.render("grupo.ejs", {
  });
});
app.get("/dograndom", (req, res) => {
  const paragrafo ={
    "textos":"ianshsuisbs",
    "textos":"kwoqhana"
  }
  const imagem =  "https://firebasestorage.googleapis.com/v0/b/forty-1a729.appspot.com/o/nodejs-api-rest-padronizada-escalavel.png?alt=media&token=f0052dee-4f09-42c9-9a5d-5c53deddec17"
  res.render("dograndom.ejs", {
    principal:"principal",
    subtitulo:"subtítulo",
    titulo:"titulo",
    meta_titulo:"dograndom",
    botao_texto:"Gerar key",
    paragrafo:"lausnduauabd jaiaha <strong> gusjs </strong> jsjabba",
  imagem:imagem
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

  app.locals.user = dograndom.auth().currentUser;
  const user = admin.auth().currentUser;

  if (user) {
  } else {
  }

  res.render("chat.ejs", {
    user: user || "&&"
  });
});
app.get("/sendPasswordReset", (req, res) =>{
  try{
    var password = '123456789'
    var email = "clecio1084@gmail.com"
firebase.auth()
    .getUserByEmail(email)
  .then((user) => {
    // Confirm user is verified.
    if (user.emailVerified) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      return getAuth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.send(error)
  });

}catch(e){
  console.error(e)
}


})

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

app.get("/avatar", async (req, res) => {
  const user_info = {
    des: "hi"
  };
 
  res.render("avatar.ejs", {
    users: null
  });
});


app.get("/api", async(req, res) =>{ 
  res.send("ok")
  })
app.use("/api/", dog_random_img);
//router

app.use("/api/database/upload", upload);
app.use("/api/database/session", sessions);

    

app.get("/logout", function(req, res) {
  req.logout();

  req.session.destroy(function(err) {
    req.user = null;

    res.redirect("/");
  });
});
app.get("/", async (req, res) => {
  res.render("server.ejs");
});
app.get("/home", (req, res) => {
  var person = req.query;
  res.render("index.ejs", { person });
});

app.get("/login", (req, res) => {
  console.log("oi cliente")
  res.render("login.ejs", {
    user: admin.auth().currentUser
  });
});

app.get("/grupo", (req, res) => {
  
  res.render("grupo.ejs", {
  });
});
app.get("/dograndom", (req, res) => {
  const paragrafo ={
    "textos":"ianshsuisbs",
    "textos":"kwoqhana"
  }
  const imagem =  "https://firebasestorage.googleapis.com/v0/b/forty-1a729.appspot.com/o/nodejs-api-rest-padronizada-escalavel.png?alt=media&token=f0052dee-4f09-42c9-9a5d-5c53deddec17"
  res.render("dograndom.ejs", {
    principal:"principal",
    subtitulo:"subtítulo",
    titulo:"titulo",
    meta_titulo:"dograndom",
    botao_texto:"Gerar key",
    paragrafo:"lausnduauabd jaiaha <strong> gusjs </strong> jsjabba",
  imagem:imagem
  });

});
app.get("/config/:id", (req, res) => {
  try {
  const user = admin.auth().currentUser;

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

  app.locals.user = dograndom.auth().currentUser;
  const user = admin.auth().currentUser;

  if (user) {
  } else {
  }

  res.render("chat.ejs", {
    user: user || "&&"
  });
});
app.get("/sendPasswordReset", (req, res) =>{
  try{
    var password = '123456789'
    var email = "clecio1084@gmail.com"
firebase.auth()
    .getUserByEmail(email)
  .then((user) => {
    // Confirm user is verified.
    if (user.emailVerified) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      return getAuth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.send(error)
  });

}catch(e){
  console.error(e)
}


})

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

app.get("/avatar", async (req, res) => {
  const user_info = {
    des: "hi"
  };
 
  res.render("avatar.ejs", {
    users: null
  });
});


app.get("/api", async(req, res) =>{ 
  res.send("ok")
  })
app.use("/api/", dog_random_img);
//router

app.use("/api/database/upload", upload);
app.use("/api/database/session", sessions);

    
