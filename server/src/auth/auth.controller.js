const multer = require('multer');
const {
  signInPipeline,
  signUpPipeline,
  isValidAccesstoken,
  isValidRefreshtoken,
  createNewAccesstokenByRefreshtoken,
  createAuthResponse,
} = require('./auth.service');

const signInController = {
  signIn: async (req, res) => {
    const { id, password } = req.body;
    const token = await signInPipeline(id, password);
    if (token.response.code === 202) {
      const { accessToken, refreshToken } = token;
      res.cookie('refreshToken', refreshToken);
      token.response.authorize = accessToken;
    }
    res.json(token.response);
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
    const bearerHeader = req.headers.Authorization;
    if (bearerHeader === undefined) return res.json(createAuthResponse('tokenUndefined'));
    const accessToken = bearerHeader.replace('Bearer', '').trim();
    res.local.verifyAccessTokenMessage = isValidAccesstoken(accessToken);
    return next();
  },

  verifyRefreshtoken: (req, res, next) => {
    switch (res.local.verifyAccessTokenMessage) {
      case 'success':
        return next();

      case 'TokenExpiredError':
        res.local.verifyRefreshTokenMessage = isValidRefreshtoken(req.cookies.refreshToken);
        return next();

      default:
        return res.json(createAuthResponse('tokenError'));
    }
  },

  requestAccessToken: async (req, res, next) => {
    if (res.local.verifyAccessTokenMessage === 'success') return next();

    switch (res.local.verifyRefreshTokenMessage) {
      case 'success':
        return res.json(await createNewAccesstokenByRefreshtoken(req.cookies.refreshToken));
      default:
        return res.json(createAuthResponse('tokenError'));
    }
  },
};

module.exports = { signUpController, signInController, authController };
