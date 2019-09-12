const request = require("request");
const cheerio = require("cheerio");

var headlinesController = require("../controllers/headlines")
var notesController = require("../controllers/notes")

module.exports = function (router) {
    router.get("/", function (req, res) {
        res.render("home");
    });
    router.get("/saved", function (req, res) {
        res.render("saved");
    });
    router.get("/api/fetch", function (req, res) {
        headlinesController.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });
    router.get("/api/headlines", function(req, res){
        var query = {};
        if (req.query.saved){
            query = req.query;
        }

        headlinesController.get(query, function(data){
            res.json(data);
        });
    });
    router.delete("/api/headlines/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    router.get("/api/notes/:headline_id?", function(req, res){
        var query = {};
        if (req.params.headline_id){
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data){
            res.json(data);
        });
    });
    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });

    router.get("/scrape", function (req, res) {
        console.log("inside the scrape route");
        // An empty array to save the scraped data
        var headlines = [];
        request("https://www.theverge.com/", (req, res, body) => {
            const $ = cheerio.load(body);
            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("h2.c-entry-box--compact__title").each(function (i, element) {
                var result = {};
                // console.log(result);
                result.title = $(this).children("a").text();
                result.link = $(this).find("a").attr("href");
                result.summary = $(this).find("a").text();
                result.saved = false;
                console.log(result);
                headlines.push(result)
            });
            console.log("***********************")
            console.log("These are the headlines: " + headlines);
            console.log("***********************")

        })
    })
}