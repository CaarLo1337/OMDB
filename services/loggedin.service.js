const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if(token) {
        jwt.verify(token, process.env.JWT_TOKEN, async (err, decodedToken) => {
            if (err) {
                res.locals.username = null;
                next();
            } else {
                let user = await User.findById(decodedToken._id);
                res.locals.username = user.name;
                next();
            }
        })
    } else {
        res.locals.username = null;
        next();
    }
};

module.exports = { isLoggedIn };