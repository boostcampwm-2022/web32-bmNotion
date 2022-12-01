const jwt = require('jsonwebtoken');
const {
  renameWorkspacePipeline,
  getWorkspacesPipeline,
  inviteUserPipeline,
  addWorkspacePipeline,
} = require('./workspace.service');

const workspaceController = {
  getWorkspaceList: async (req, res) => {
    const { id: userId } = jwt.decode(req.headers.authorization);
    const resJson = await getWorkspacesPipeline(userId);

    res.json(resJson);
  },

  addWorkspace: async (req, res) => {
    const { id: userId } = jwt.decode(req.headers.authorization);
    const resJson = await addWorkspacePipeline(userId);
    res.json(resJson);
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
