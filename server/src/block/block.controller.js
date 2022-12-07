const path = require('path');
const fs = require("fs");
const stream = require('node:stream');
const { uploadImg, createObjectUrl } = require('../utils/objectStorage.util');

const imageController = {
  processImage: async (req, res) => {
    /**
     * 이미지 이름은 어떻게???
     */
    const file = req.body;
    
    // uploadImg('jhjSampleImage', {buffer: file})

    const url = createObjectUrl('jhjSampleImage');
    res.status(202).json({url, code: '202'});
  }
};

module.exports = { imageController };
