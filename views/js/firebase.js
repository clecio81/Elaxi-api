function gg() {
  try {
    
    if (!firebase.apps.length) {
      firebase.initializeApp(conf);
    } else {
      firebase.app(); // if already initialized, use that one
    }

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    
    // When the user signs in with email and password.
    var email = document.getElementById("email");

    var senha = document.getElementById("senha");
    alert(senha.value)
   
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, senha.value)
      .then(user => {
      
        // Get the user's ID token as it is needed to exchange for a session cookie.

        user.getIdToken().then(idToken => {
          
          const csrfToken = getCookie("csrfToken");
          
          return postIdTokenToSessionLogin("/sessionLogin", idToken, csrfToken);
        });
      })
      .then(() => {
        // A page redirect would suffice as the persistence is set to NONE.

        return firebase.auth().signOut();
      })
      .then(() => {
        window.location.assign("/profile");
      });
  } catch (error) {
    alert(error)
    
  }
  }
