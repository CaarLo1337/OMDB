// node_modules
const express = require("express");
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser');

// dotenv
const dotenv = require('dotenv');
dotenv.config();

//
const { isLoggedIn } = require('./controllers/isLoggedIn');


// - mongodb connection -
require('./config/db');


// - Template Engine EJS -
app.set("view engine", "ejs");


// ---------------------------
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.static("public"));


// - routes -
app.get('*', isLoggedIn);


// - import routes -
const mainRoutes = require('./routes/home'); // '/' main page , '/results' moviesearch
const authRoutes = require('./routes/auth'); // '/login' & '/register'
const ProfileRoute = require('./routes/profile'); // '/profile' 


// - Route Middlewares -
app.use(mainRoutes);
app.use(authRoutes); // login & register
app.use('/profile', ProfileRoute);


// show error if path dont exist
app.get("*", (req, res) => {
    res.render("error");
});


// - set port -
const port = process.env.PORT || 3000;


// - Listen to Port -
app.listen(port, () => {
    console.log('\n*  Server listening on port ' + port);
    console.log('*  http://localhost:' + port + '\n');
});