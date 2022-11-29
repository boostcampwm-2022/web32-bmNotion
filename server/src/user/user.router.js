const { Router } = require('express');
const userController = require('./user.controller');

const router = Router();

router.get('/:nickname', userController.searchUser);

module.exports = router;
