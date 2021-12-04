const passport = require('passport');

const FirebaseStrategy = require('passport-firebase-auth').Strategy;

passport.use(new FirebaseStrategy({

    firebaseProjectId: "forty-1a729",

    authorizationURL: "forty-1a729.firebaseapp.com",

    callbackURL: '/auth/firebase/callback'

  },

  function(accessToken, refreshToken, decodedToken, cb) {

  	return cb(null, decodedToken);    // User.findOrCreate({

    // 	'googleid': decodedToken.uid

    // }, function (err, user) {

    //   return cb(err, user);

    // });

  }

));

passport.serializeUser(function(user, done) {

  done(null, user);

});

passport.deserializeUser(function(obj, done) {

  done(null, obj);

});

module.exports = passport;