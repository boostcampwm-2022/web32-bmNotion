const { Router } = require('express');
const { imageController } = require('./block.controller');

const router = Router();

router.post('/image', imageController.processImage);

module.exports = router;
