const { Router } = require('express');
const { signInController, signUpController } = require('./auth.controller');

const router = Router();

router.use('/signin', signInController.signIn);
router.use('/signup', signUpController.readProfileImg, signUpController.signUp);

module.exports = router;
