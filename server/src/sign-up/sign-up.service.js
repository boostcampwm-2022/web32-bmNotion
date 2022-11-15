const AWS = require('aws-sdk');
const stream = require('node:stream');

const region = 'kr-standard';
const accessKey = `${process.env.ACCESS_KEY}`;
const secretKey = `${process.env.SECRET_KEY}`;
const S3 = new AWS.S3({
  endpoint: 'https://kr.object.ncloudstorage.com',
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

const uploadImg = async (objectName, file) => {
  const bucketName = 'bmnotion';
  await S3.upload({
    Bucket: bucketName,
    Key: objectName,
    Body: stream.Readable.from(file.buffer),
  }).promise();
};

module.exports = uploadImg;
