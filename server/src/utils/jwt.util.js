const jwt = require('jsonwebtoken');

const createNewAccesstoken = (id, nickname) => {
  const accessToken = jwt.sign(
    {
      nickname,
      id,
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: '1h',
    },
  );

  return accessToken;
};

const createNewRefreshtoken = () => {
  const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET_KEY, {
    expiresIn: '24h',
  });

  return refreshToken;
};

const isValidAccesstoken = (accessToken) => {
  try {
    jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    return 'success';
  } catch (error) {
    return error.name;
  }
};

const isValidRefreshtoken = (refreshToken) => {
  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    return 'success';
  } catch (error) {
    return error.name;
  }
};

module.exports = {
  createNewAccesstoken,
  createNewRefreshtoken,
  isValidAccesstoken,
  isValidRefreshtoken,
};
