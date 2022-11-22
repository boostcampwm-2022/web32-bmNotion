const jwt = require('jsonwebtoken');
const { addPagePipeline } = require('./page.service');

const pageController = {
  addPage: async (req, res) => {
    console.log(req.body);
    const { id: userid } = jwt.decode(req.headers.Autorization);
    const resJson = await addPagePipeline(userid);
    res.json(resJson);
  },
};

module.exports = pageController;
