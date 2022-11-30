const { Router } = require('express');
const userController = require('./user.controller');

const router = Router();

router.get('/search/:nickname', userController.searchUser);
router.get('/profile/:id', userController.getProfileUrl);

module.exports = router;
