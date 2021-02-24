const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");
const rp = require('request-promise');

const dotenv = require('dotenv');
dotenv.config();

//___________________________________________________

app.use(express.static("lib"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

app.get("/", (req, res) => {
    var randomId = Math.floor(Math.random() * (1285017 - 1285000) + 1285000); //random number between 1285017 and 1285000
    //console.log(randomId.toString()); // print movieID
    randomMovie = 'http://omdbapi.com/?i=tt' + randomId.toString() + '&apikey=' + process.env.API_KEY;
    var result;
    rp(randomMovie)
    .then((body) => {
        result = JSON.parse(body)
        //console.log(JSON.stringify(result)); //print json in console
    })
    
    res.render("page");
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

app.get("*", (req, res) => {
    res.render("error");
});

