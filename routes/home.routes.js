const router = require('express').Router();
const request = require('request-promise');
const axios = require('axios');
const { response } = require('express');



router.get("/", (req, res) => {
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
    request(randomMovie)
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

/*router.get("/results", (req, res) => {
    const searchedMovie = 'http://omdbapi.com/?s=' + req.query.movie + '&apikey=' + process.env.API_KEY; 
    const movieDetails = [];
    var results;
    request(searchedMovie)
    .then((body) => {
        results = JSON.parse(body);
        //console.log(JSON.stringify(results)); //print json in console
        if(results['Response']=='True'){
            for(let i=0; i<results['Search'].length; i++) {
                request('http://omdbapi.com/?i=' + results['Search'][i]['imdbID'] + '&apikey=' + process.env.API_KEY)
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
});*/


router.get("/results/page=:page", (req, res) => {
    const page = req.params.page || 1; //
    const searchedMovie = 'http://omdbapi.com/?s=' + req.query.movie + '&page=' + page + '&apikey=' + process.env.API_KEY;
    const movieDetails = [];
    axios.get(searchedMovie)
        .then(response => {
            results = response.data;
            maxPages = Math.round(response.data['totalResults'] / 10);
            for(let i=0; i<results['Search'].length; i++) {
                movieDetails.push(results['Search'][i]);
            }
            res.render('movieresults', { 
                movieDetails: movieDetails, 
                movieQuery: req.query.movie,
                currentPage: page,
                maxPages: maxPages
            });
        })
        .catch(error => {
            console.log('ops');
            res.redirect('/');
        })
});

module.exports = router; 