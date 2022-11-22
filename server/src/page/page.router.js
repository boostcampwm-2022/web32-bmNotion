const { Router } = require('express');
const { authController } = require('../auth/auth.controller');
const pageController = require('./page.controller');

const router = Router();

router.use(
  '/*',
  authController.verifyAccesstoken,
  authController.verifyRefreshtoken,
  authController.requestAccessToken,
);
router.use('/addpage', pageController.addPage);

module.exports = router;