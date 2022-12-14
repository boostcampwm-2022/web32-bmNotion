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
router.post('/rename', workspaceController.rename);
router.get('/info/:workspaceid', workspaceController.getInfo);
router.get('/spaceinfo/:pageid', workspaceController.getWorkspace);

module.exports = router;
