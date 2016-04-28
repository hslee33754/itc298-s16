//node module
var book = require('./lib/book.js'); 

//express
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

//static files and views
app.use(express.static(__dirname + '/public'));

//setting port 
app.set('port', process.env.PORT || 3000); //app.listen(3000);?

/* ======================= GET ======================= */ 
//get-home
app.get('/', function(req, res){
    res.render('home', {book:book.getAllBooks(), message:book.getMessage()});
});

//get-add
app.get('/add', function(req, res){
    //showing add form 
    res.render('add');
});

/* ======================= POST ======================= */ 
//post-search
app.post('/search', function(req, res){
    var userKeyword = req.body.userInput.toLowerCase();
    res.render('home', { book:book.getSearchResults(userKeyword), message:book.getMessage(), btn_total:"show"});
});

//post-delete
app.post('/delete', function(req, res){
    //handleing delete and redirct to home
    var userKeyword = req.body.userInput.toLowerCase();
    res.render('home', {book:book.deleteABook(userKeyword), message:book.getMessage()});
});

//post-update
app.post('/update', function(req, res){
    //takes the user input and check if matched
    var userKeyword = req.body.userInput.toLowerCase();
    var item = book.getMatchedItem(userKeyword);
    var message = '';
    if(item){
        //if matched, show update form with the values entered
        res.render('update', {item:item});
    }else{  
        //if not, don't update
        message = "Can't update the item. '" + userKeyword + "' is not in your List.";
        res.render('home', {book:book.getAllBooks, message});
    }
});

app.post('/updateProcess', function(req, res){
    //takes new inputs and process update function to replace the data 
    var title = req.body.inputTitle;
    var author = req.body.inputAuthor;
    var price = req.body.inputPrice;
    res.render('home', {book:book.update(title, author, price), message:book.getMessage()});
});

//post-add
app.post('/add', function(req, res){
    //handleing form from add and render it to home
    var id = book.genNextId();
    var title = req.body.inputTitle;
    var author = req.body.inputAuthor;
    var price = req.body.inputPrice;
    var date = new Date();
    var sold = false;
    var theBook = {id, title, author, price, date, sold};
    res.render('home', {book:book.addABook(theBook, title.toLowerCase()), message:book.getMessage()});
});

/* ======================= HTTP ERROR HANDELER ======================= */ 
//404 Not Found
app.use(function(req, res){
   res.status(404);
   res.render('404');
});

//500 Internal Server Error
app.use(function(err, req, res, next){
   console.error(err.stack);
   res.status(500);
   res.render('500');
});

/* ======================= START SERVER ======================= */ 
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});