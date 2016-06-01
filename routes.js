module.exports = function(app){

//node module
//var book = require('./lib/book.js'); 

//model 
var Book = require('./models/book.js');

//body-Parser Configuration
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

//set Cross-Origin Resource Sharing
app.use('/api', require('cors')());

//file upload handler
var formidable = require('formidable');

//data directory
var fs = require('fs');
var dataDir = __dirname + '/public';
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

app.post('/updateProcess', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return console.log(err);
        var theId = fields.inputId;
        Book.findById(theId, function (err, theBook) {
            if (err) return console.error(err);
            
            // handle files
            if(files.photo.size != 0){
                var photo = files.photo;
                var dir = bookPhotoDir + '/' + Date.now();
                var path = dir + '/' + photo.name;
                fs.mkdirSync(dir);
                fs.renameSync(photo.path, dir + '/' + photo.name);
                var newPath = path.replace('/home/ubuntu/workspace/public/','../');
                theBook.photoUrl = newPath;
            }else{
                
            }
            theBook.title = fields.inputTitle;
            theBook.author = fields.inputAuthor;
            theBook.price = fields.inputPrice;
            theBook.sold = fields.selectSold === "true";
            theBook.save();
            var title = "Kate's itc298 home";
            var message = theBook.title + " is updated.";
            res.render('detail', {theBook, message, title, btn_total:"show"});
        });
    });
});


//post-add
app.post('/add', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return console.log(err);
        
        // handle files
        if(files.photo.size != 0){
            var photo = files.photo;
            var dir = bookPhotoDir + '/' + Date.now();
            var path = dir + '/' + photo.name;
            fs.mkdirSync(dir);
            fs.renameSync(photo.path, dir + '/' + photo.name);
            var newPath = path.replace('/home/ubuntu/workspace/public/','../');
        }else{
            var newPath = null;
        }
        
        var theBook = new Book({
           title: fields.inputTitle,
           author: fields.inputAuthor,
           price: fields.inputPrice,
           dateAdded : new Date(),
           sold : false,
           photoUrl: newPath
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

//post-delete
app.post('/delete', function(req, res){
    var theId = req.body.theId;
    Book.findOne({_id: theId}, function(err, book) {
        if (err) console.error(err);

        var message = book.title + " is removed. We have " + Book.length + " total books.";
        var title = "Kate's itc298";
        book.remove();
        
        Book.find({}, function(err, books) {
            if (err) console.error(err);
            res.render('home', {book:books, message, title});
        });
    });
});

//post-update
app.post('/update', function(req, res){
    var theId = req.body.theId;
    Book.findOne({_id:theId}, function(err, abook) {
        if (err) console.error(err);
        var title = "Kate's itc298 update";
        res.render('update', {abook, title, btn_total:"show"});
    });
});

/* ======================= API ======================= */ 
app.get('/api/books', function(req, res){
    Book.find({}, function(err, books) {
        if (err) console.error(err);
        res.json(books)
    });
    
});

app.get('/api/book/:theId', function(req,res){
    var theId = req.params.id;
    Book.findById(theId, function (err, theBook) {
        if (err) return console.error(err);
        res.json(theBook);
    });
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