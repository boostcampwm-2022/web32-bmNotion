const multer = require('multer');
const { signInPipeline, signUpPipeline } = require('./auth.service');

const signInController = {
  signIn: (req, res) => {
    const { id, password } = req.body;
    const token = signInPipeline(id, password);
    if (token.response.code === 202) {
      const { accessToken, refreshToken } = token;
      res.cookie('accessToken', accessToken).cookie('refreshToken', refreshToken);
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

module.exports = { signUpController, signInController };
