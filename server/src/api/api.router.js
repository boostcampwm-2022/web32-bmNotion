const { Router } = require('express');
const signUpRouter = require('../sign-up/sign-up.router');

const router = Router();

router.use('/sign-up', signUpRouter);

module.exports = router;
