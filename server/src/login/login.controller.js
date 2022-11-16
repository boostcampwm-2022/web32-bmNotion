const { loginPipeline } = require("./login.service");

const loginController = (req, res) => {
      const { id, password } = req.body;
      const token = loginPipeline(id, password);
      if(token!==undefined){
        const { accessToken, refreshToken } = token;
        res.cookie('accessToken',accessToken).cookie('refreshToken',refreshToken).status(200).send('login sucess')
      }
      else{
        res.send('login fail');
      }
    }
  
  
  module.exports = loginController;