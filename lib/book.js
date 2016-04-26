var books = [
    {id: 0, title:'Fifty Shades of Grey', author:'E L James', price:9.56, dateAdded: '3/3/2016', sold: true},
    {id: 1, title:'The Hunger Games', author:'Suzanne Collins', price:6.70, dateAdded: '4/16/2016', sold: false},
    {id: 2, title:'Catching Fire', author:'Suzanne Collins', price:7.92, dateAdded: '4/17/2016', sold: false},
    {id: 3, title:'Mockingjay', author:'Suzanne Collins', price:7.48, dateAdded: '4/18/2016', sold: false},
    {id: 100, title:'Fifty Shades Darker', author:'E L James', price:11.48, dateAdded: '4/22/2016', sold: true}
];

var message = ''; 
var count = books.length;

exports.getAllBooks = function(){
    message = '';
    return books;
};

exports.genNextId = function(){
    return books[books.length-1].id + 1;
    //Since id is not always successive, do not use length. Get the id of the last item and add 1.
};

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
        message = count + " item(s) results for '" + userKeyword + "'";
    }
    
    return results; //Do not return books. Return search result temporarily.
};

exports.addABook = function(aBook, userInput){
    var theTitle = aBook.title;
    var idx = books.indexOf(matchedItem(userInput));
    
    if(idx > -1){
        //see if the title is exist in the list
        message = "Can't add it. We already have '" + theTitle + "' in the list.";
    }else{
        books.push(aBook);
        message = "'" + theTitle + "' is added. We have " + count + " total books.";
    }
    return books;
};


var matchedItem = function(userKeyword){
    var isMatched = function(obj){
        var title = obj.title.toLowerCase();
        return title === userKeyword;
    };
    return books.find(isMatched); //return matched object
};

exports.deleteABook = function(userInput){
    var idx = books.indexOf(matchedItem(userInput));
    
    if(idx > -1){
        //see if the title is exist in the list
        message = "'" + books[idx].title + "' is deleted.";
        books.splice(idx,1);
    }else{
        message = "Can't delet it. '" + userInput + "' is not on your List.";
    }
    return books;
};

exports.getMessage = function(){
    return message;
};