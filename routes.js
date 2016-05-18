module.exports = function(app){

//node module
var book = require('./lib/book.js'); 

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
    res.render('home', {book:book.getAllBooks(), message:book.getMessage(), title});
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
app.get('/detail/:theTitle', function(req, res){
    var myTitle = req.params.theTitle.toLowerCase();
    var myItem = book.getMatchedItem(myTitle);
    title = "Kate's ITC298 - " + req.params.theTitle;
    res.render('detail', {myItem, title, btn_total:"show"});
});

/* ======================= POST ======================= */ 
//post-search
app.post('/search', function(req, res){
    var userKeyword = req.body.userInput.toLowerCase();
    res.render('home', {book:book.getSearchResults(userKeyword), message:book.getMessage(), btn_total:"show"});
});

//post-delete/:theTitle
app.post('/delete/:theTitle', function(req, res){
    //handleing delete and redirct to home
    var theTitle = req.params.theTitle.toLowerCase();
    res.render('home', {book:book.deleteABook(theTitle), message:book.getMessage()});
});

//post-delete
app.post('/delete', function(req, res){
    //handleing delete and redirct to home
    var userKeyword = req.body.userInput.toLowerCase();
    res.render('home', {book:book.deleteABook(userKeyword), message:book.getMessage()});
});

//post-update/:theTitle
app.post('/update/:theTitle', function(req, res){
    //takes the user input and check if matched
    var theTitle = req.params.theTitle.toLowerCase();
    var item = book.getMatchedItem(theTitle);
    res.render('update', {item});

});

//post-update
app.post('/update', function(req, res){
    //takes the user input and check if matched
    var userKeyword = req.body.userInput.toLowerCase();
    var item = book.getMatchedItem(userKeyword);
    var message = '';
    if(item){
        //if matched, show update form with the values entered
        res.render('update', {item});
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
    var sold = req.body.selectSold === "true"; //true/false as boolean
    res.render('home', {book:book.update(title, author, price, sold), message:book.getMessage()});
});

//post-add
app.post('/add', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.render('500');
        //console.log('received fields:');
        //console.log(fields);
        //console.log('received files:');
        //console.log(files);
        
        //creates new id
        var id = book.genNextId(); 
        
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
        //var theBook = {id, title, author, price, date, sold};
        //res.render('home', {book:book.addABook(theBook, title.toLowerCase()), message:book.getMessage()});
    
        var theBook = new Book({
           title: theTitle,
           author: theAuthor,
           price: theprice,
           dateAdded : new Date(),
           sold : false
        });
        
        //console.log(theBook);
        
        theBook.save(function(err){
            if(err) return console.log(err);
            res.send(theBook);
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