const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/user/loginUser');
const rigisterUser = require('../controllers/user/registerUser');
const logoutUser = require('../controllers/user/logoutUser');
const homePage = require('../controllers/homePages/homePageController');
const findAllController = require('../controllers/user/findAllUsers');
const updateUserController = require('../controllers/user/updateUser');

router.get('/',homePage);
router.post('/welcome', loginUser);
router.post('/register', rigisterUser);
router.get('/logout', logoutUser);
router.get('/users', findAllController);
router.put('/update', updateUserController);


module.exports = router;