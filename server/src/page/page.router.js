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
router.post('/addpage', pageController.addPage);
router.get('/:pageid', pageController.loadPage);
router.get('/list/:workspaceid', pageController.readPages);

module.exports = router;
