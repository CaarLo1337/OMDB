const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.services');
// - mongodb user model -
const User = require('../models/user.model');


// register get
module.exports.register_get = (req, res) => {
    res.render('register.ejs', { message: req.flash('message') });
}

//register post
module.exports.register_post = async (req, res) => {

    // validate register input 
    const { error } = authService.registerValidation(req.body);
    if (error) {
        req.flash('message', 'wrong credentials');
        res.redirect('/register');
        return
    }

    // check if user exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) {
        req.flash('message', 'email is allready in use');
        res.redirect('/register');
        return
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user with hashed password
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    // save user to db
    try{ 
        const savedUser = await user.save();
        // redirect to login
        res.redirect('/login');
    }catch(err){
        res.status(400).send(err);
    }
}

// login get
module.exports.login_get = (req, res) => {
    res.render('login.ejs', { message: req.flash('message') });
}

// login post
module.exports.login_post = async (req, res) => {
    
    // validate login input 
    const { error } = authService.loginValidation(req.body);
    if (error) {
        req.flash('message', 'Incorrect E-Mail or Password');
        res.redirect('/login')
        return 
    }

     // check if email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        req.flash('message', 'Incorrect E-Mail or Password');
        res.redirect('/login')
        return 
    }  

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        req.flash('message', 'Incorrect E-Mail or Password');
        res.redirect('/login')
        return 
    }
    
    // create and assign a jwt
    const accessToken = await jwt.sign({ _id: user._id}, process.env.JWT_TOKEN, { expiresIn: 30* 60000 }); // expires in 30min
    //save the accessToken in a httpOnly cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // set true if using https
        maxAge: 30 * 60000 // time in miliseconds // 30min
    });
    res.redirect('/profile');
}

// logout get
module.exports.logout_get = (req, res) => {
    res.clearCookie('accessToken'); // removes the token from userbrowser
    // redirect to home
    res.redirect('/');
}