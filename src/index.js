// node_modules
const express = require("express");
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();


// - import routes -
const MainRouter = require('../src/api/routes/home'); // '/' main page , '/results' moviesearch
const UserRouter = require('../src/api/routes/auth'); // '/login' & '/register'
const ProfileRoute = require('../src/api/routes/profile'); // '/profile' 



// - import helpers -
const isLoggedIn = require('../src/api/helpers/isLoggedIn'); // check if user is logged in



// - set Port -
const port = process.env.PORT || 3000;


// - mongodb connection -
require('./config/db');



// - Template Engine EJS -
app.set("view engine", "ejs");



// ---------------------------
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.static("src/lib"));



// - use helpers -
app.use(isLoggedIn);



// - Route Middlewares -
app.use(MainRouter);
app.use(UserRouter); // login & register
app.use('/profile', ProfileRoute);



// show error if path dont exist
app.get("*", (req, res) => {
    res.render("error");
});



// - Listen to Port -
app.listen(port, () => {
    console.log('\n*  Server listening on port ' + port);
    console.log('*  http://localhost:' + port + '\n');
});