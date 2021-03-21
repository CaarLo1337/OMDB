// node_modules
const express = require("express");
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser');

// dotenv
const dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');
const flash = require('connect-flash');



//
const { isLoggedIn } = require('./services/loggedin.service');


// - mongodb connection -
require('./config/db.config');


// - Template Engine EJS -
app.set("view engine", "ejs");


// ---------------------------
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.static("public"));

app.use(session({
    secret: 'secret',
    cookie: { maxAge : 60000},
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


// - routes -
app.get('*', isLoggedIn);


// - import routes -
const mainRoutes = require('./routes/home.routes'); // '/' main page , '/results' moviesearch
const authRoutes = require('./routes/auth.routes'); // '/login' , '/register' , '/logout'
const profileRoutes = require('./routes/profile.routes'); // '/profile' 
const userRoutes = require('./routes/user.routes'); // '/user'


// - Route Middlewares -
app.use(mainRoutes); // home
app.use(authRoutes); // login & register
app.use(profileRoutes); // profile 
app.use(userRoutes); // user


// show error if path dont exist
app.get("*", (req, res) => {
    res.render("error");
});


// - set port -
const port = process.env.PORT || 4000;


// - Listen to Port -
app.listen(port, () => {
    console.log('\n*  Server listening on port ' + port);
    console.log('*  http://localhost:' + port + '\n');
});