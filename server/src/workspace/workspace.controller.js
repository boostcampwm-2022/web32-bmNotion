const jwt = require('jsonwebtoken');
const { readWorkspaceById } = require('./workspace.service');

const workspaceController = {
  getWorkspaceList: async (req, res) => {
    const { id: userId } = jwt.decode(req.headers.Autorization);
    const resJson = await readWorkspaceById(userId);

    res.json(resJson);
  },
  addWorkspace: (req, res) => {
    console.log(req);
  },
  inviteUser: (req, res) => {
    console.log(req);
  },
};

module.exports = workspaceController;
