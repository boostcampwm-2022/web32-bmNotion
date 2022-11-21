const multer = require('multer');
const { signInPipeline, signUpPipeline, isValidAccesstoken, isValidRefreshtoken, createNewAccesstokenByRefreshtoken } = require('./auth.service');

const signInController = {
  signIn: (req, res) => {
    const { id, password } = req.body;
    const token = signInPipeline(id, password);
    if (token.response.code === 202) {
      const { accessToken, refreshToken } = token;
      res.cookie('refreshToken', refreshToken);
      token.response.authorize = accessToken;
    }
    res.json(token.response);
  },
};

const signUpController = {
  readProfileImg: multer({ storage: multer.memoryStorage() }).single('image'),
  signUp: async (req, res) => {
    const { file, body } = req;
    const { id, passWord, nickName } = body;
    const resJson = await signUpPipeline(id, passWord, nickName, file);
    res.json(resJson);
  },
};

const authController = {
  verifyAccesstoken: (req, res, next) => {
    const bearerHeader = req.headers['Authorization'];
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
        return res.json({ auth: 'fail' });
    }
  },

  requestAccessToken: async (req, res, next) => {
    if (res.local.verifyAccessTokenMessage === 'success') return next();

    switch (res.local.verifyRefreshTokenMessage) {
      case 'success':
        const accessToken = await createNewAccesstokenByRefreshtoken(req.cookies.refreshToken);
        return res.json(accessToken);
      default:
        return res.json({ auth: 'fail' });
    }
  },
};

module.exports = { signUpController, signInController, authController };
