const express = require('express');
const passport = require('passport');
const getNewTokens = require('../controllers/auth/newToken');
const resetPassword = require('../controllers/auth/password/resetPassword');
const updatePassword = require('../controllers/auth/password/updatePassword');
const setNewPass = require('../controllers/auth/password/setNewPassword');
const facebookLogin = require('../controllers/auth/facebook/login');

const router = express.Router();

router.get('/refresh', getNewTokens);
router.post('/reset', resetPassword);
router.get('/setnewpass', setNewPass);
router.post('/updatepass', updatePassword);
router.get('/facebook', passport.authenticate("facebook",{ scope : ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {session: false}), facebookLogin);

module.exports = router;