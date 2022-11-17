const { Router } = require('express');
const signUpRouter = require('../sign-up/sign-up.router');
const loginRouter = require('../login/login.router');

const router = Router();

router.use('/auth/login', loginRouter);
router.use('/auth/sign-up', signUpRouter);

module.exports = router;
