const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/user/loginUser');
const rigisterUser = require('../controllers/user/registerUser');
const logoutUser = require('../controllers/user/logoutUser');
const homePage = require('../controllers/homePages/homePageController');
const findAllController = require('../controllers/user/findAllUsers');
const tokenVeryficator = require('../service/tokenVeryficator');

router.get('/',homePage);
router.post('/welcome', tokenVeryficator, loginUser);
router.post('/register', tokenVeryficator, rigisterUser);
router.get('/logout',logoutUser);
router.post('/users',tokenVeryficator, findAllController);


module.exports = router;