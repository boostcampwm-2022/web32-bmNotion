const { processImagePipeline } = require('./block.service');

const imageController = {
  processImage: async (req, res) => {
    const file = req.body;
    const { fileName } = req.params;

    const response = await processImagePipeline(file, fileName);

    res.send(response);
  },
};

module.exports = { imageController };
