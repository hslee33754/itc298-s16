module.exports = function(app){

//node module
//var book = require('./lib/book.js'); 

//model 
var Book = require('./models/book.js');

//body-Parser Configuration
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

//file upload handler
var formidable = require('formidable');

//data directory
var fs = require('fs');
var dataDir = __dirname + '/data';
var bookPhotoDir = dataDir + '/book-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(bookPhotoDir) || fs.mkdirSync(bookPhotoDir);


/* ======================= GET ======================= */ 
var title ="Kate's ITC298 Home";
//get-home
app.get('/', function(req, res){
    title ="Kate's ITC298 Home";
    Book.find({}, function(err, books) {
        if (err) console.error(err);
        var message = "We have " + books.length + " total books.";
        res.render('home', {book:books, message, title});
    });
});

//get-add
app.get('/add', function(req, res){
    //showing add form 
    title = "Kate's ITC298 Add";
    res.render('add', {title});
});

//get-about
app.get('/about', function(req, res){
    //showing add form 
    title = "Kate's ITC298 About";
    res.render('about', {title});
});

//get-detail
app.get('/detail/:id', function(req, res){
    var theId = req.params.id;
    Book.findById(theId, function (err, theBook) {
        if (err) return console.error(err);
        title = "Kate's ITC298 - " + theBook.title;
        res.render('detail', {theBook, title, btn_total:"show"});
    });
});

/* ======================= POST ======================= */ 
//post-search
app.post('/search', function(req, res){
    var userKeyword = req.body.userInput;
    Book.find({title:new RegExp(userKeyword, "i")}, function(err, books) {
        if (err) console.error(err);
        var message = "We have " + books.length + " total books.";
        var title = "Kate's itc298 search result";
        res.render('home', {book:books, message, title, btn_total:"show"});
    });
});

//post-delete/:id
app.post('/delete/:id', function(req, res){
    var theId = req.params.id;
    Book.findOne({_id: theId}, function(err, book) {
        if (err) console.error(err);
        var message = book.title + " is removed.";
        var title = "Kate's itc298";
        book.remove();
        
        Book.find({}, function(err, books) {
            if (err) console.error(err);
            res.render('home', {book:books, message, title});
        });
    });
});

//post-update/:id
app.post('/update/:id', function(req, res){
    //takes the user input and check if matched
    var theId = req.params.id;
    Book.findOne({_id:theId}, function(err, abook) {
        if (err) console.error(err);
        var title = "Kate's itc298 update";
        res.render('update', {abook, title, btn_total:"show"});
    });
});

app.post('/updateProcess', function(req, res){
    //takes new inputs and process update function to replace the data 
    var theId = req.body.inputId;
    var theTitle = req.body.inputTitle;
    var theAuthor = req.body.inputAuthor;
    var thePrice = req.body.inputPrice;
    var theSold = req.body.selectSold === "true"; //true/false as boolean
    
    Book.findById(theId, function (err, book) {
      if (err) return console.error(err);
      
      book.title = theTitle;
      book.author = theAuthor;
      book.price = thePrice;
      book.sold = theSold;
      book.save(function (err) {
        if (err) return console.error(err);
        Book.find({}, function(err, books) {
            if (err) console.error(err);
            var title = "Kate's itc298 home";
            var message = book.title + " is updated.";
            res.render('home', {book:books, message, title});
        });
      });
    });
    
});

//post-add
app.post('/add', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return console.log(err);

        //handles fields (body parser isn't working with enctype="multipart/form-data")
        //you should parse the inputs using formidable fields
        var theTitle = fields.inputTitle;
        var theAuthor = fields.inputAuthor;
        var theprice = fields.inputPrice;
        
        // handle files
        var photo = files.photo;
        var dir = bookPhotoDir + '/' + Date.now();
        var path = dir + '/' + photo.name;
        fs.mkdirSync(dir);
        fs.renameSync(photo.path, dir + '/' + photo.name);
        var date = new Date();
        var sold = false;

        var theBook = new Book({
           title: theTitle,
           author: theAuthor,
           price: theprice,
           dateAdded : new Date(),
           sold : false
        });
        
        theBook.save(function(err){
            if(err) return console.log(err);
        });
        
        var message = "You've added " + theBook.title;
        
        Book.find({}, function(err, books) {
          if(err) return console.log(err);
          res.render('home', {book:books, message, title});
        });
    });
    
});

/* ======================= API ======================= */ 
app.get('/api/books', function(req, res){
    var books= book.getAllBooks();
    if(books){
        res.json(books);
    }else{
        res.status(500).send('Error occurred: database error.');
    }
    
});

app.get('/api/book/:theTitle', function(req,res){
    var theTitle = req.params.theTitle.toLowerCase();
    var theBook = book.getMatchedItem(theTitle);
    if(theBook){
        res.json(theBook);
    }else{
        res.status(404).send("No matched item");
    }
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

    
};