const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.cookies.accessToken || '';
    if(!token) return res.status(401).send('access denied!');
    
    try{
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('invalid token');
    }
}