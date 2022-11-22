const { Router } = require('express');
const { authController } = require('../auth/auth.controller');
const { editController } = require('./edit.controller');

const router = Router();

router.use(
  '/*',
  authController.verifyAccesstoken,
  authController.verifyRefreshtoken,
  authController.requestAccessToken,
);

router.use('/', editController);

module.exports = router;
