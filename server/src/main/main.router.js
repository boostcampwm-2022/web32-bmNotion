const { Router } = require('express');
const mainController = require('./main.cotroller');

const router = Router();

router.get('/', mainController.Main);
// router.get('/*', mainController.directUrlAccess);

module.exports = router;
