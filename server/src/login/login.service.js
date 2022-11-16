const jwt = require('jsonwebtoken');

const searchUserById = (id) => {
    // todo
    // search user by id or nickname
    const user = [id];
    return user;
  };

const encryptPassword = (password) => {
    // todo
    // password encrypt logic
    const encrypted = password;
    return encrypted;
  };

const loginPipeline = (id, password)=>{
    const user = searchUserById(id)
    const encrypted = encryptPassword(password);
    if(encrypted === user.password){
        const accessToken = jwt.sign({nickname: user.nickname, id: user.id},process.env.ACCESS_SECRET_KEY,{
            expiresIn:'1h'
        });
        const refreshToken = jwt.sign({},process.env.REFRESH_SECRET_KEY,{
            expiresIn:'24h'
        })
        return {accessToken, refreshToken}
    }
    else{
        return undefined;
    }
}
module.exports = { loginPipeline }