const { Router } = require('express');
const { signInController, signUpController } = require('./auth.controller');

const router = Router();

router.post('/signin', signInController.signIn);
router.post('/signup', signUpController.readProfileImg, signUpController.signUp);

module.exports = router;
