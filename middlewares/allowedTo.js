const ERROR = require("../utils/ERROR");

module.exports = (...roles) => {
    console.log('cureent roles', roles);
    return (req, res, next) => {
        if(!req.currentUser || !roles.includes(req.currentUser.role)) {
            return next(ERROR.create("this role not Auth", 403));
        }
        next();
    }
}