var books = [
    {id: 0, title:'Fifty Shades of Grey', author:'E L James', price:9.56, dateAdded: '3/3/2016', sold: true},
    {id: 1, title:'The Hunger Games', author:'Suzanne Collins', price:6.70, dateAdded: '4/16/2016', sold: false},
    {id: 2, title:'Catching Fire', author:'Suzanne Collins', price:7.92, dateAdded: '4/17/2016', sold: false},
    {id: 3, title:'Mockingjay', author:'Suzanne Collins', price:7.48, dateAdded: '4/18/2016', sold: false},
    {id: 100, title:'Fifty Shades Darker', author:'E L James', price:11.48, dateAdded: '4/22/2016', sold: true}
];
var getInput = '';
var message = '';
var count = books.length;
//home
exports.getAllBooks = function(){
    message = books.length + " total books"; //restore message from after 
    return books;
};

exports.getCount = function(){
    return count;
};

//search
exports.getSearchResults = function(userKeyword){
    var isSearched = function(obj){
        var title = obj.title.toLowerCase();
        return title.includes(userKeyword);
    };
    
    var results = books.filter(isSearched);
    
    var count = results.length;
    
    if(results.length == 0){
        message = "There's no matched item for '" + userKeyword + "'.";
    }
    else{
        message = count + " result(s) for '" + userKeyword + "'";
    }
    
    return results; //Do not return books. Return search result temporarily.
};

//find matched item
var matchedItem = function(userKeyword){
    var isMatched = function(obj){
        var title = obj.title.toLowerCase();
        return title === userKeyword;
    };
    return books.find(isMatched); //return matched object
};

exports.getMatchedItem = function(userInput){
    var idx = books.indexOf(matchedItem(userInput));
    getInput = userInput;
    return books[idx];
};

//delete
exports.deleteABook = function(userInput){
    var idx = books.indexOf(matchedItem(userInput));
    
    if(idx > -1){
        //see if the title is exist in the list
        message = "'" + books[idx].title + "' is deleted.";
        books.splice(idx,1);
        message += " We have " + books.length + " books."
    }else{
        message = "Can't delete it. '" + userInput + "' is not in your List.";
    }
    return books;
};

//update
exports.update = function(myTitle, myAuthor, myPrice){
    var idx = books.indexOf(matchedItem(getInput));
    books[idx].title = myTitle;
    books[idx].author = myAuthor;
    books[idx].price = myPrice;
    
    message = "'" + myTitle + "' is updated.";
    return books;
};

//add
exports.genNextId = function(){
    return books[books.length-1].id + 1;
    // Since id is not always successive, 
    // do not use length to create id value. 
    // Get the id of the last item and then add 1.
};

exports.addABook = function(aBook, userInput){
    var theTitle = aBook.title;
    var idx = books.indexOf(matchedItem(userInput));
    
    if(idx > -1){
        //see if the title is exist in the list
        message = "Can't add it. We already have '" + theTitle + "' in the list.";
    }else{
        books.push(aBook);
        message = "'" + theTitle + "' is added. We have " + books.length + " total books.";
    }
    return books;
};

//get message
exports.getMessage = function(){
    return message;
};

//sort
var sortByPrice = function (book1, book2){
  return book1.price - book2.price;
};

var sortByAuthor = function(book1, book2){
  if ( book1.author.toLowerCase() < book2.author.toLowerCase() )
    return -1;
  if ( book1.author.toLowerCase() > book2.author.toLowerCase() )
    return 1;
  return 0;
};

exports.sort = function(sortBy){
    if(sortBy == "author"){
        return books.sort(sortByAuthor);
    }
    else if(sortBy =="price"){
        return books.sort(sortByPrice);
    }
};