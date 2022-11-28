const { Router } = require('express');
const { authController } = require('../auth/auth.controller');
const workspaceController = require('./workspace.controller');

const router = Router();

router.use(
  '/*',
  authController.verifyAccesstoken,
  authController.verifyRefreshtoken,
  authController.requestAccessToken,
);
router.get('/list', workspaceController.getWorkspaceList);
router.post('/addworkspace', workspaceController.addWorkspace);
router.post('/invite', workspaceController.inviteUser);

module.exports = router;
