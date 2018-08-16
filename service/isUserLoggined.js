module.exports = async (postgres,token) => {
    if (!token || !postgres) throw new Error('Have not postgres or token');
    const TokenModel = postgres.getModel('Token');
    const isTokenPresent = await TokenModel.findOne({
        where: {
            accessToken: token
        }
    });
    if (!isTokenPresent) throw new Error('U are not logged');
    return isTokenPresent
};
