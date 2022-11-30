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
});

const createObjectUrl = (objectName) => {
  const params = { Bucket: bucketName, Key: objectName };
  const url = S3.getSignedUrl('getObject', params);
  return url;
};

const uploadImg = async (objectName, file) => {
  if (file === undefined) return;
  await S3.upload({
    Bucket: bucketName,
    Key: objectName,
    Body: stream.Readable.from(file.buffer),
  }).promise();
};

module.exports = { S3, bucketName, createObjectUrl, uploadImg };
