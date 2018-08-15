const express = require('express');
const getNewTokens = require('../controllers/token/newTokenController');
const router = express.Router();

router.get('/refresh', getNewTokens);

module.exports = router;