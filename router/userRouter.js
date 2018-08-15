const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/user/loginUser');
const rigisterUser = require('../controllers/user/registerUser');
const homePage = require('../controllers/homePages/homePageController');
const findAllController = require('../controllers/user/findAllUsers');

router.get('/',homePage);
router.post('/welcome',loginUser);
router.post('/register', (req, res, next)=>{
    console.log('we are here');
    next();
},rigisterUser);
router.post('/users',findAllController);


module.exports = router;