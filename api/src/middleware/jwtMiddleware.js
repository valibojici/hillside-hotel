const jwt = require('jsonwebtoken');

// extract and verify the token if its present, otherwise just call next
const JWTMiddleware = (req, res, next) => {
    // extract jwt token from the request header
    const token = req.headers?.authorization?.replace('Bearer ', '');
    // if it doesnt exist
    if (!token) {
        next();
        return;
    }
    // verify the jwt and extract payload
    try {
        req.jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // jwt not valid
        console.log(error.message);
    }
    next();
}

module.exports = { JWTMiddleware };