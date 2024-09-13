const express = require('express');
const Image = require('../models/Image');
const imageController = require('../controllers/imageController');
const router = express.Router();


router.post('/upload', imageController.uploadImages);
router.delete('/delete', imageController.deleteImage);

module.exports = router