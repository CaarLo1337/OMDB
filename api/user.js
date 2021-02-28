const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// - mongodb user model -
const User = require('./../models/user');

// - Register -
router.post('/register', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "failed",
            message: "emty input fields!"
        })
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "failed",
            message: "invalid name entered"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "failed",
            message: "invalid email entered"
        })
    } else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "failed",
            message: "invalid date of birth entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "failed",
            message: "password is to short"
        }) 
    } else {
        //checking if user allready exists
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: "failed",
                    message: "user with this email already exists"
                })
            } else {
                // create new user
                
                // password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth,
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "success",
                            message: "signup successful",
                            data: result
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "failed",
                            message: "an error occurred while saving user account"
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "failed",
                        message: "an error occurred while hashing password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "failed",
                message: "an error occurred while checking for existing user!"
            })
        })
    }
})

// - Login -
router.post('/login', (req, res) => {

})

module.exports = router;