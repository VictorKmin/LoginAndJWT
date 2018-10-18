module.exports = async (postgres,token) => {
    if (!token || !postgres) throw new Error('Have not postgres or auth');
    const TokenModel = postgres.getModel('Token');
    const isTokenPresent = await TokenModel.findOne({
        where: {
            accessToken: token
        }
    });
    console.log('+++++++++++++++++');
    console.log(isTokenPresent);
    console.log('+++++++++++++++++');
    if (!isTokenPresent) throw new Error('U are not logged');
    return isTokenPresent
};
