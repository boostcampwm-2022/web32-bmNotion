const { createObjectUrl, uploadImg } = require('../utils/objectStorage.util');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');
const sharp = require('sharp');
const sha256 = require('sha256');
const sizeOf = require('image-size');

const resizeImg = async (file) => {
  const dimension = sizeOf(file);
  const maxWidth = 200;
  const maxHeight = 300;
  if (dimension.width < maxWidth && dimension.height < maxHeight) return file;

  const transData = await sharp(file)
    .resize(parseInt((dimension.width * 3) / 4), parseInt((dimension.height * 3) / 4), {
      fit: 'contain',
    })
    .withMetadata()
    .toBuffer();
  return transData;
};

const getFileName = (fileName) => {
  const nowDate = Date.now().toString();
  return sha256(fileName + nowDate).slice(1, 9);
};

const getFileInfo = async (fileName, data) => {
  const baseFileName = getFileName(fileName);
  await uploadImg(baseFileName, { buffer: data });
  const url = createObjectUrl(baseFileName);

  return { fileName: baseFileName, url };
};

const processImagePipeline = async (file, fileName) => {
  const transData = await resizeImg(file);
  const fileInfo = await getFileInfo(fileName, transData);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.url = fileInfo.url;
  response.fileName = fileInfo.fileName;

  return response;
};

module.exports = {
  processImagePipeline,
};
