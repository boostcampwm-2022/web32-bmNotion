const jwt = require('jsonwebtoken');
const { editPipeline } = require('./edit.service');

const editController = async (req, res) => {
  const { id: userid } = jwt.decode(req.headers.Autorization);
  const { pageid, blocks } = req.body;
  const resJson = await editPipeline(userid, pageid, blocks);
  res.json(resJson);
};

module.exports = { editController };
