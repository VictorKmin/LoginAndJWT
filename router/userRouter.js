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
        cb(null, id + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === "image/png") {
        cb(null, true)
    }
    cb(null, false)
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

router.get('/', homePage);
router.post('/welcome', loginUser);
router.post('/register',
    // upload.single('file'),
    rigisterUser);
router.get('/logout', logoutUser);
router.get('/users', findAllController);

router.put('/update', updateUserController);



router.post('/hapi', (req,res)=> {

    /**
     * hapi.js
     * Joi validation
     *  https://scotch.io/tutorials/node-api-schema-validation-with-joi
     * @param schema - validation schema
     * @param  name/email - params from req.body.
     * Name in the request (req.body.key) and in the object (schema.key) must be the same !
     */
    let joi = require('joi');

    const schema= joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    joi.validate(req.body, schema, (err, data)=> {
        if (err) {
            res.json(err)
        }  else {
            res.json(data)
        }
    });
});


module.exports = router;