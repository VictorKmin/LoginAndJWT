const express = require('express');
const router = express.Router();
const createStudio = require('../controllers/studio/createStudio');
const deleteStudio = require('../controllers/studio/deleteStudio');
const findAll = require('../controllers/studio/findAllStudios');
const updateStudio = require('../controllers/studio/updateStudio');


router.get('/',findAll);
router.post('/', createStudio);
router.put('/', updateStudio);
router.delete('/', deleteStudio);

module.exports = router;