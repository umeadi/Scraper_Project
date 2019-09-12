// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Setup our port to be either the host's designated port, or 9000
var PORT = process.env.PORT || 9000;

// Setup an Express app
var app = express();

// Setup an Express router
var router = express.Router();
require("./config/routes")(router);

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlbars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use body parser in the application
app.use(bodyParser.urlencoded({ extended: false }));

// Have every request go through our Router middleware
app.use(router);

// If deployed use the deplyed database. Otherwise the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect Mongoose to our database
mongoose.connect(db, function(error){
    // Log any erros connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log success message
    else {
        console.log("mongoose connection is successful");
    }
});


//Listen on the port #
app.listen(PORT, function() {
    console.log("***************************")
    console.log("App listening on port: " + PORT);
    console.log("***************************")
});