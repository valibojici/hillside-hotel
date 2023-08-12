const AdminGuard = (req, res, next) => {
    // extract jwt token from the request header
    if (req.jwtPayload?.data?.role !== 'admin') {
        res.status(403).json({ 'message': 'Not Allowed' });
        return;
    }
    next();
}

module.exports = { AdminGuard };