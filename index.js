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
    //sets new variable each time post accurs
    var message = '';
    var userKeyword = req.body.search.toLowerCase();
    var results = []
    var i;
    
    for ( i = 0; i < books.length; i++ ) {
        var position = books[i].title.toLowerCase().search(userKeyword);
        
        if (position == -1) {
            //do nothing
        } else {
            //push the object to new result array
            results.push( books[i] );
        }
    }
    
    if (results.length == 0){
        message = "There's no matched item for " + userKeyword + ".";
    }else{
        message = results.length + " item(s) results for '" + userKeyword + "'";
    }

    res.render('search', {results, message});
});

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune:randomFortune});
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

//for about page test
var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
];

var books = [
    {id: 0, title:'Fifty Shades of Grey', author:'E L James', price:'$9.56'},
    {id: 1, title:'The Hunger Games', author:'Suzanne Collins', price:'$6.70'},
    {id: 2, title:'Catching Fire', author:'Suzanne Collins', price:'$7.92'},
    {id: 3, title:'Mockingjay', author:'Suzanne Collins', price:'$7.48'},
    {id: 4, title:'Fifty Shades Darker', author:'E L James', price:'$11.48'}
];