var book = require('./lib/books.js'); 
var fortune = require('./lib/fortune.js'); 
var express = require('express');

var app = express();

//set up handlebars view engine
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//body-Parser Configuration
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

//static files and views handler (middleware)
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000); //app.listen(3000);?

app.post('/search', function(req, res){
    
    var userKeyword = req.body.search.toLowerCase();
    var searchResults = book.getSearchResults(userKeyword);
    var count = book.getResultCounts();
    
    var getMessage = function(count, userKeyword){
        if (count == 0){
            return "There's no matched item for '" + userKeyword + "'.";
        }else{
            return count + " item(s) results for '" + userKeyword + "'";
        }
    };

    res.render('search', { results:searchResults, message:getMessage(count, userKeyword)});
});

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {fortune: fortune.randomFortune()});
});

//404 catch-all handler (middleware)
app.use(function(req, res){
   res.status(404);
   res.render('404');
});

//500 error handler (middleware)
app.use(function(err, req, res, next){
   console.error(err.stack);
   res.status(500);
   res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});