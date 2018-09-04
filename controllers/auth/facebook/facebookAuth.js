const passport = require('passport');
const fbStrategy = require('passport-facebook').Strategy;
const fbParams = require('../../../constants/facebookParams');
passport.use(new fbStrategy({
        clientID: fbParams.appId,
        clientSecret: fbParams.secretKey,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        cb(null, profile);
    }
));