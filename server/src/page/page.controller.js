const jwt = require('jsonwebtoken');
const { addPagePipeline, loadPagePipeline, readPages } = require('./page.service');

const pageController = {
  addPage: async (req, res) => {
    console.log(req.body);
    const { id: userid } = jwt.decode(req.headers.Autorization);
    const resJson = await addPagePipeline(userid);
    res.json(resJson);
  },

  loadPage: async (req, res) => {
    const { pageid } = req.params;
    console.log(req.body);
    const { id: userid } = jwt.decode(req.headers.Authorization);
    const resJson = await loadPagePipeline(userid, pageid);
    res.json(resJson);
  },

  readPages: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.Authorization);
    console.log(userid);
    const pages = await readPages(userid);

    res.send(pages);
  },
};

module.exports = pageController;
