const jwt = require('jsonwebtoken');

// extract and verify the token if its present, otherwise just call next
const JWTMiddleware = (req, res, next) => {
    // extract jwt token from the request header
    const token = req.headers.authorization?.replace('Bearer ', '');
    // if it doesnt exist
    if (!token) {
        next();
        return;
    }
    // verify the jwt and extract payload
    try {
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.jwtPayload = jwtPayload;
    } catch (error) {
        // jwt not valid
        console.log(error);
    }
    next();
}

module.exports = { JWTMiddleware };