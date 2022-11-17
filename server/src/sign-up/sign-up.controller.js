const multer = require('multer');
const { signUpPipeline } = require('./sign-up.service');

const signUpController = {
  readProfileImg: multer({ storage: multer.memoryStorage() }).single('image'),
  signUp: async (req, res) => {
    const { file, body } = req;
    const { id, passWord, nickName } = body;
    const resJson = await signUpPipeline(id, passWord, nickName, file);
    res.json(resJson);
  },
};

module.exports = signUpController;
