const tokenizer = require('/service/tokenizer');
//TODO
module.exports = (req, res)=> {
    let userName = req.body.name;
    let password = req.body.password;
    let token = tokenizer(userName, password);
    console.log(token);
  //   let userToSave = {
  //     name: userName,
  //     password: password,
  //     token: token
  // }
};