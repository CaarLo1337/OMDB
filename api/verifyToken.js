const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //const token = req.header('auth-token');
    const authHeader = req.header.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(401).send('access denied!');
    
    try{
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('invalid token');
    }
}