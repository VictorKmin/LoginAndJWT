const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const googleParams = require('../../../constants/googleParams');
passport.use(new googleStrategy({
        clientID: googleParams.clientID,
        clientSecret: googleParams.secretKey,
        callbackURL: "http://localhost:3000/auth/google/callback",
        // profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        cb(null, profile);
    }
));