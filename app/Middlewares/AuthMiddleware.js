const { hashSecret } = require('../../config/Config');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (req.headers.apptoken && req.headers.apptoken !== '') {
        const authData = jwt.verify(req.headers.apptoken, hashSecret);
        req.headers.authData = authData;
        return await next();
    }
    return res.send(401, {"error": "Authentication Failed"});
    
};