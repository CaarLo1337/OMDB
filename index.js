const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rp = require('request-promise');
const dotenv = require('dotenv');

// - mongodb -
require('./config/db')

// - dotenv -
dotenv.config();

// - set Port -
const port = 3000;

// -        -
app.use(express.static("lib"));

// - Template Engine EJS -
app.set("view engine", "ejs");

// -        -
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded( { extended: false}));


// - Listen to Port -
app.listen(port, () => {
    console.log('\n*  Server listening on port ' + port);
    console.log('*  http://localhost:' + port + '\n');
});

// - Routes -

app.get("/", (req, res) => {
    const topTitle = [
        "WandaVision",
        "Soul",
        "Tenet",
        "Palmer",
        "Boss Level"
    ]
    let randomItem = topTitle[Math.floor(Math.random()*topTitle.length)];
    //console.log(randomItem);
    randomMovie = 'http://omdbapi.com/?t=' + randomItem + '&apikey=' + process.env.API_KEY;
    
    //var randomId = Math.floor(Math.random() * (1286000 - 1285000) + 1285000); //random number between 1285017 and 1285000
    //console.log(randomId.toString()); // print movieID
    //randomMovie = 'http://omdbapi.com/?i=tt' + randomId.toString() + '&apikey=' + process.env.API_KEY;
    
    const randomDetails = [];
    let result;
    rp(randomMovie)
    .then((body) => {
        result = JSON.parse(body)
        //console.log(JSON.stringify(result)); //print json in console
        if(result['Response']=='True'){
            if(result['Poster']=='N/A') {
                res.render('error');
            } else {
                randomDetails.push(JSON.parse(body))
                //console.log(JSON.stringify(randomDetails));
                res.render('page',{result: result, randomDetails: randomDetails});
            }
        } else {
            res.render('error')
        }
    })
});

app.get("/results", (req, res) => {
    const searchedMovie = 'http://omdbapi.com/?s=' + req.query.movie + '&apikey=' + process.env.API_KEY; 
    const movieDetails = [];
    var results;
    rp(searchedMovie)
    .then((body) => {
        results = JSON.parse(body);
        //console.log(JSON.stringify(results)); //print json in console
        if(results['Response']=='True'){
            for(let i=0; i<results['Search'].length; i++) {
                rp('http://omdbapi.com/?i=' + results['Search'][i]['imdbID'] + '&apikey=' + process.env.API_KEY)
                .then(data => {
                    movieDetails.push(JSON.parse(data));
                    //console.log(JSON.stringify(movieDetails)); //print json in console
                    if(movieDetails.length === results['Search'].length){
                        res.render('resultspage',{results: results, keyword: req.query.movie, movieDetails: movieDetails});
                    }
                })
            }
            console.log(results['Search'].length);
        } else {
            res.render('resultspage',{results: results, keyword: req.query.movie, movieDetails: movieDetails});
        }
    })
    .catch((err) => {
        try{
            const displayError = JSON.parse(err['error']);
            console.log(displayError['Error']);
            res.render('resultspage',{results: {'Response': 'False', 'Error': displayError['Error']}, keyword: req.query.movie});
        }
        catch {
            console.log('upps something went wrong')
        }
    });
});


// login
app.get('/login', (req, res) => {
    res.render('login.ejs')
})


// register
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

// show error if path dont exist
app.get("*", (req, res) => {
    res.render("error");
});

