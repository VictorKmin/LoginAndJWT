const express = require('express');
const router = express.Router();
const loginUser = require('../controllers/user/loginUser');
const rigisterUser = require('../controllers/user/registerUser');
const logoutUser = require('../controllers/user/logoutUser');
const homePage = require('../controllers/homePages/homePageController');
const findAllController = require('../controllers/user/findAllUsers');
const updateUserController = require('../controllers/user/updateUser');

const id = require('uuid').v1();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, id+file.originalname)
    }
});
const fileFilter = (req, file, cb)=> {
    if (file.mimetype === 'image/jpeg' || file.mimetype === "image/png") {
        cb(null,true)
    }
    cb(null,false)
};
const upload = multer({storage: storage,
    limits: {
    fileSize: 1024*1024*10
    },
    fileFilter
});

router.get('/', homePage);
router.post('/welcome', loginUser);
router.post('/register',upload.single('file'), rigisterUser);
router.get('/logout', logoutUser);
router.get('/users', findAllController);
router.put('/update', updateUserController);


module.exports = router;