const jwt = require('jsonwebtoken');
const {
  renameWorkspacePipeline
  getWorkspacesPipeline,
  inviteUserPipeline,
} = require('./workspace.service');

const workspaceController = {
  getWorkspaceList: async (req, res) => {
    const { id: userId } = jwt.decode(req.headers.authorization);
    const workspaces = await getWorkspacesPipeline(userId);

    res.json(workspaces);
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
  rename: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.authorization);
    const { workspace: workspaceid, name: workspacename } = req.body;
    const resJson = await renameWorkspacePipeline(userid, workspaceid, workspacename);
    res.json(resJson);
  },
};

module.exports = workspaceController;
