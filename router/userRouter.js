const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/user/loginUser');
const getLogin = require('../controllers/homePages/loginConroller');
const rigisterUser = require('../controllers/user/registerUser');
const homePage = require('../controllers/homePages/homePageController');

router.get('/',homePage);
router.post('/welcome',loginUser);
router.post('/login',rigisterUser);
router.get('/login',rigisterUser);
// router.get('/login',getLogin);

module.exports = router;