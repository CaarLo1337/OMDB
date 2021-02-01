const express = require("express");
const app = express();
app.use(express.static("lib"));

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const request = require("request");

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});

app.get("/", function(request, response) {
    response.render("page");
});

app.get("*", function(request, response) {
    response.render("error");
});

