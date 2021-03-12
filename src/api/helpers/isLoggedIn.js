const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.cookies.accessToken || '';
    if(token) {
        //console.log('-------new try-----\n')
        //console.log('token true');
        //console.log(token);
        try {
            //console.log(req.user);
            const verified = jwt.verify(token, process.env.JWT_TOKEN); // check if token is valid
            req.user = verified; 
            //console.log('\nverified req.user');
            //console.log(req.user);
            res.locals.loggedIn = req.user; 
            //console.log(res.locals);
            next();
        } catch(err) {
            //console.log('\ninvalid token');
            res.locals.loggedIn = null;
            next();
        }
    } else {
        //console.log('\nno token');
        //console.log(token)
        res.locals.loggedIn = null;
        next();
    }
}