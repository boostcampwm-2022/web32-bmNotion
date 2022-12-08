const path = require('path');
const fs = require('fs');
const stream = require('node:stream');
const { createObjectUrl } = require('../utils/objectStorage.util');
const crypto = require('crypto');

const AWS = require('aws-sdk');
const stream = require('node:stream');

const region = 'kr-standard';
const bucketName = process.env.BUCKET_NAME;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_KEY;

const S3 = new AWS.S3({
  endpoint: 'https://kr.object.ncloudstorage.com',
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  ContentEncoding: 'gzip',
});

const uploadImg = async (objectName, file) => {
  if (file === undefined) return;
  await S3.upload({
    Bucket: bucketName,
    Key: objectName,
    Body: stream.Readable.from(file.buffer),
  }).promise();
};


const imageController = {
  processImage: async (req, res) => {
    /**
     * 이미지 이름은 어떻게???
     */
    const file = req.body;
    // console.log(file);
    // console.log(file.buffer);
    // console.log(file.buffer.toString());
    // console.log(typeof file);
    // console.log(file.toString());
    // const objectName = crypto.createHmac('sha256').update(file.toString()).digest('hex');
    const objectName = "jhjSample3"
    await uploadImg(objectName, {buffer: file});
    const url = createObjectUrl(objectName);
    res.status(202).json({ url, code: '202' });
    // res.status(400).end();
  },
};

module.exports = { imageController };
