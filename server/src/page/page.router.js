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
router.post('/edit', pageController.editPage);
router.post('/addpage', pageController.addPage);
router.get('/list/:workspaceid', pageController.readPages);
router.delete('/delete/:workspaceid/:pageid', pageController.deletePage);
router.get('/:pageid', pageController.loadPage);

module.exports = router;
