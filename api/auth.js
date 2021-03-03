const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require ('../validation');

// - mongodb user model -
const User = require('../models/user');


// - Register -
router.post('/register', async (req, res) => {
    // validate register input 
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
        res.send({ user: user._id });
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
        const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);
        res.header('auth-token', token).send(token);

        res.send('Logged in!');

});

module.exports = router; 