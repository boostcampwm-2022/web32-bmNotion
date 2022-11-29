const { searchUserPipeline } = require('./user.service');

const userController = {
  searchUser: async (req, res) => {
    const { nickname } = req.params;
    const resJson = await searchUserPipeline(nickname);
    res.json(resJson);
  },
};

module.exports = userController;
