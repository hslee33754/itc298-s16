var books = [
    {id: 0, title:'Fifty Shades of Grey', author:'E L James', price:9.56, dateAdded: '3/3/2016', sold: true},
    {id: 1, title:'The Hunger Games', author:'Suzanne Collins', price:6.70, dateAdded: '4/16/2016', sold: false},
    {id: 2, title:'Catching Fire', author:'Suzanne Collins', price:7.92, dateAdded: '4/17/2016', sold: false},
    {id: 3, title:'Mockingjay', author:'Suzanne Collins', price:7.48, dateAdded: '4/18/2016', sold: false},
    {id: 100, title:'Fifty Shades Darker', author:'E L James', price:11.48, dateAdded: '4/22/2016', sold: true}
];

var results = []; //new array for result display

exports.getAllBooks = function(){
    return books;
};

exports.getBooksCouts = function(){
    return books.length;
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
    results = books.filter(isSearched);
    return results;
};

exports.getResultCounts = function(){
    return results.length;
};

exports.addABook = function(aBook){
    return books.push(aBook); //returns total number of books after adding the book
};
