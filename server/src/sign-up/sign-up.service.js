const AWS = require('aws-sdk');
const stream = require('node:stream');

const region = 'kr-standard';
const bucketName = 'bmnotion';
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
  await S3.upload({
    Bucket: bucketName,
    Key: objectName,
    Body: stream.Readable.from(file.buffer),
  }).promise();
};

const searchUser = (id, nickname) => {
  // todo
  // search user by id or nickname
  const user = [id, nickname];
  return user;
};

const createObjectUrl = (objectName) => {
  const params = { Bucket: bucketName, Key: objectName };
  const url = S3.getSignedUrl('getObject', params);
  return url;
};

const encryptPassword = (password) => {
  // todo
  // password encrypt logic
  const encrypted = password;
  return encrypted;
};

const saveUser = (id, password, nickname, objectName) => {
  // todo
  // insert User info
  const encryptedPw = encryptPassword(password);
  const user = [id, nickname, encryptedPw, objectName];
  return user;
};

module.exports = {
  uploadImg,
  searchUser,
  saveUser,
  createObjectUrl,
};
