const express = require('express');
const getNewTokens = require('../controllers/auth/newToken');
const resetPassword = require('../controllers/auth/resetPassword');

const router = express.Router();

router.get('/refresh', getNewTokens);
router.get('/reset', resetPassword);

module.exports = router;