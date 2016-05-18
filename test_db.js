//model 
var Book = require('./models/book.js');

new Book({title:'Catching Fire', author:'Suzanne Collins', price:7.92, dateAdded: '4/17/2016', sold: false}).save();
new Book({title:'Mockingjay', author:'Suzanne Collins', price:7.48, dateAdded: '4/18/2016', sold: false}).save();
new Book({title:'Fifty Shades Darker', author:'E L James', price:11.48, dateAdded: '4/22/2016', sold: true}).save();

Book.find({}, function(err, books) {
  if (err) throw err;

  // object of all the books
  console.log(books);
});