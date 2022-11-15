const multer = require('multer');
const uploadImg = require('./sign-up.service');

const signUpController = {
  readProfileImg: multer({ storage: multer.memoryStorage() }).single('img'),
  signUp: (req, res) => {
    const { id, password } = req.body;
    const { file } = req;
    const objectName = `${id}.profile`;
    uploadImg(objectName, file);
    res.send(200);
  },
};

module.exports = signUpController;
