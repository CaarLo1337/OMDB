const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

module.exports = {
    getUserData
}

async function getUserData(req, res, next) {
    const token = req.cookies.accessToken;
    jwt.verify(token, process.env.JWT_TOKEN, async (err, decodedToken) => {
        if (err) {
            next();
        } else {
            let user = await User.findById(decodedToken._id);
            res.locals.admin = user.role;
            next();
        }
    })
}