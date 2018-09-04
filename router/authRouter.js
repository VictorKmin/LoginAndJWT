const express = require('express');
const getNewTokens = require('../controllers/auth/newToken');
const resetPassword = require('../controllers/auth/resetPassword');
const updatePassword = require('../controllers/auth/updatePassword');
const setNewPass = require('../controllers/auth/setNewPassword');

const router = express.Router();

router.get('/refresh', getNewTokens);
router.post('/reset', resetPassword);
router.get('/setnewpass', setNewPass);
router.post('/updatepass', updatePassword);

module.exports = router;