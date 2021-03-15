const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
                res.locals.isadmin = user.isAdmin;
                next();
            }
        })
    } else {
        res.locals.username = null;
        next();
    }
};

module.exports = { isLoggedIn };

/*module.exports = function(req, res, next) {
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
            
            res.locals.loggedIn = req.user; 
            //console.log(res.locals);
            //console.log(req.user);
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
}*/