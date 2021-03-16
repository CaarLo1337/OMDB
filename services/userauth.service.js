const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = function(req, res, next) {
    const token = req.cookies.accessToken || '';
    if(!token) return res.status(401).send('access denied!');
    
    jwt.verify(token, process.env.JWT_TOKEN, async (err, decodedToken) => {
        if(err) {
            res.status(400).send('invalid token');
        } else {
            let user = await User.findById(decodedToken._id);
            if(user.role !== 'admin') return res.status(401).send('access denied! no admin');
            next();
        }
    })
}