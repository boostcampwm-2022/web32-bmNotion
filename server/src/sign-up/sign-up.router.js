const { Router } = require('express');
const signUpController = require('./sign-up.controller');

const router = Router();

router.post('/', signUpController.readProfileImg, signUpController.signUp);

module.exports = router;
