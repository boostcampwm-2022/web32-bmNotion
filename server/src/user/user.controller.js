const { searchUserPipeline, getProfilePipeline } = require('./user.service');

const userController = {
  searchUser: async (req, res) => {
    const { nickname } = req.params;
    const resJson = await searchUserPipeline(nickname);
    res.json(resJson);
  },
  getProfileUrl: (req, res) => {
    const { id } = req.params;
    const resJson = getProfilePipeline(id);
    res.json(resJson);
  },
};

module.exports = userController;
