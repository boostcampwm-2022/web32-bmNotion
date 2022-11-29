const jwt = require('jsonwebtoken');
const { inviteUserPipeline } = require('./workspace.service');

const workspaceController = {
  getList: (req, res) => {
    console.log(req);
  },
  addWorkspace: (req, res) => {
    console.log(req);
  },
  inviteUser: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.authorization);
    const { workspace: workspaceid, nickname } = req.body;
    const resJson = await inviteUserPipeline(userid, workspaceid, nickname);
    res.json(resJson);
  },
};

module.exports = workspaceController;
