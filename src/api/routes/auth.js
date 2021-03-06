const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../helpers/validation');//('../../Helpers/validation');

// - mongodb user model -
const User = require('../models/user');


// - Register -
router.post('/register', async (req, res) => {
    // validate register input 
    const { error } = registerValidation(req.body);
    //if (error) return res.status(400).send(error.details[0].message);
    if (error) return res.status(400).send(error);

    // check if user exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

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
        res.redirect('/user/login');
    }catch(err){
        res.status(400).send(err);
    }
});

// - Login - 
router.post('/login', async (req, res) => {
        // validate login input 
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

         // check if email exists
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Email! or password is wrong'); // '!' only for debugging

        // check if password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Email or password! is wrong'); // '!' only for debugging

        // create and assign a jwt
        const accessToken = await jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: 86400 });
        //const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN);
        //res.header('auth-token', accessToken).send(accessToken);
        //res.json({ accessToken: accessToken, refreshToken: refreshToken })
        //res.send('Logged in!');
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false, // set true if using https
            maxAge: 86400
        });
        res.redirect('/profile');
});


router.get('/login', (req, res) => {
    res.render('login.ejs')
})

// register
router.get('/register', (req, res) => {
    res.render('register.ejs')
})

module.exports = router; 