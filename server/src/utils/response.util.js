const responseMessage = require('../response.message.json');

const createResponse = (message) => {
  const response = { code: '500' };
  switch (message) {
    case responseMessage.PROCESS_SUCCESS:
      response.code = '202';
      response.message = responseMessage.PROCESS_SUCCESS;
      break;
    case responseMessage.SIGNIN_FAIL:
      response.code = '404';
      response.message = responseMessage.SIGNIN_FAIL;
      break;
    case responseMessage.EXIST_NICKNAME:
      response.code = '404';
      response.message = responseMessage.EXIST_NICKNAME;
      break;
    case responseMessage.EXIST_ID:
      response.code = '404';
      response.message = responseMessage.EXIST_ID;
      break;
    case responseMessage.AUTH_FAIL:
      response.code = '404';
      response.message = responseMessage.AUTH_FAIL;
      break;
    case responseMessage.PAGE_NOT_FOUND:
      response.code = '404';
      response.message = responseMessage.PAGE_NOT_FOUND;
      break;
    case responseMessage.RENEWAL_TOKEN:
      response.code = '100';
      response.message = responseMessage.RENEWAL_TOKEN;
      break;
    case responseMessage.USER_NOT_FOUND:
      response.code = '404';
      response.message = responseMessage.USER_NOT_FOUND;
      break;
    case responseMessage.EXIST_BOTH:
      response.code = '404';
      response.message = responseMessage.EXIST_BOTH;
      break;
    case responseMessage.NEED_SIGNIN:
      response.code = '404';
      response.message = responseMessage.NEED_SIGNIN;
      break;
    default:
      break;
  }
  return response;
};

module.exports = createResponse;
