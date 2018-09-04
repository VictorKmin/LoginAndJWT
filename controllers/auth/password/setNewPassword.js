module.exports = (req, res)=> {
    const token = req.query.token;
    console.log(token);
    res.render('newPass', {token});
};