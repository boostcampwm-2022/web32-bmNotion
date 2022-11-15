const multer = require('multer');
const { uploadImg, searchUser, saveUser } = require('./sign-up.service');

const signUpController = {
  readProfileImg: multer({ storage: multer.memoryStorage() }).single('img'),
  signUp: (req, res) => {
    const { id, password, nickname } = req.body;
    const user = searchUser(id, nickname);
    if (!user) {
      const { file } = req;
      const objectName = `${id}.profile`;
      saveUser(id, password, nickname, objectName);
      uploadImg(objectName, file);
      res.send(200);
    } else if (user.nickname === nickname) {
      res.send('exist nickname');
    } else if (user.id === id) {
      res.send('exist id');
    }
    res.send(500);
  },
};

module.exports = signUpController;
