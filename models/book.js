//credentials
var credentials = require('../credentials.js');

//database connection
var mongoose = require('mongoose');
mongoose.connect(credentials.mongo.connectionString);

//database schema
var Schema = mongoose.Schema;
var bookSchema =new Schema({
    title: String, 
    author: String, 
    price: Number,
    dateAdded: Date, 
    sold: Boolean
});

//custom method
bookSchema.method.getCurrency = function(){
    return '$' + this.price.toFixed(2);
};

//create model
var Book = mongoose.model('Book', bookSchema);

//make it avilable in the application
module.exports = Book;

