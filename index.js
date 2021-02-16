const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");

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
    res.render("page");
});

app.get("/results", (req, res) => {
    const searchedMovie = req.query.searchValue;
    const queryString = "http://omdbapi.com/?s=" + searchedMovie + "&apikey=" + process.env.API_KEY;
    
    
    request(queryString, function(error, response, body) {
        if(!error && response.statusCode == 200){
            var parseData = JSON.parse(body);
            //console.log(parseData["Search"][0]["Title"]);
            res.render("results", {data: parseData});
        }
    });
});

app.get("*", (req, res) => {
    res.render("error");
});

