const axios = require('axios');
const request = require('request-promise');

module.exports = {
    home_get,
    results_get
}

function home_get(req, res) {
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
}

function results_get(req, res) {
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
}