const { Router } = require('express');
const loginController = require('./login.controller');

const router = Router();

router.post('/login', loginController);

module.exports = router;
