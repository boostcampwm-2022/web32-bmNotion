const multer = require('multer');
const {
  signInPipeline,
  signUpPipeline,
  isValidAccesstoken,
  isValidRefreshtoken,
  createNewAccesstokenByRefreshtoken,
} = require('./auth.service');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');

const signInController = {
  signIn: async (req, res) => {
    const { id, password } = req.body;
    const { refreshToken, response: resJson } = await signInPipeline(id, password);
    res.cookie('refreshToken', refreshToken).json(resJson);
  },
};

const signUpController = {
  readProfileImg: multer({ storage: multer.memoryStorage() }).single('profileimage'),
  signUp: async (req, res) => {
    const { file, body } = req;
    const { id, password, nickname } = body;
    const resJson = await signUpPipeline(id, password, nickname, file);
    res.json(resJson);
  },
};

const authController = {
  verifyAccesstoken: (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader === undefined) return res.json(createResponse(responseMessage.NEED_SIGNIN));
    const accessToken = bearerHeader.replace('Bearer', '').trim();
    res.locals.verifyAccessTokenMessage = isValidAccesstoken(accessToken);
    return next();
  },

  verifyRefreshtoken: (req, res, next) => {
    switch (res.locals.verifyAccessTokenMessage) {
      case 'success':
        return next();

      case 'TokenExpiredError':
        res.locals.verifyRefreshTokenMessage = isValidRefreshtoken(req.cookies.refreshToken);
        return next();

      default:
        return res.json(createResponse(responseMessage.AUTH_FAIL));
    }
  },

  requestAccessToken: async (req, res, next) => {
    if (res.locals.verifyAccessTokenMessage === 'success') return next();

    if (res.locals.verifyRefreshTokenMessage === 'success') {
      const resJson = createResponse(responseMessage.RENEWAL_TOKEN);
      resJson.accessToken = await createNewAccesstokenByRefreshtoken(req.cookies.refreshToken);
      return res.json(resJson);
    }
    return res.json(createResponse(responseMessage.AUTH_FAIL));
  },
};

module.exports = { signUpController, signInController, authController };
