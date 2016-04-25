var bookList = [
    {id: 0, title:'Fifty Shades of Grey', author:'E L James', price:9.56, dateAdded: '3/3/2016', sold: true},
    {id: 1, title:'The Hunger Games', author:'Suzanne Collins', price:6.70, dateAdded: '4/16/2016', sold: false},
    {id: 2, title:'Catching Fire', author:'Suzanne Collins', price:7.92, dateAdded: '4/17/2016', sold: false},
    {id: 3, title:'Mockingjay', author:'Suzanne Collins', price:7.48, dateAdded: '4/18/2016', sold: false},
    {id: 4, title:'Fifty Shades Darker', author:'E L James', price:11.48, dateAdded: '4/22/2016', sold: true}
];

var results = []; //new array for result display

exports.getSearchResults = function(userKeyword){
    
    var isSearched = function(obj){
        var title = obj.title.toLowerCase();
        return title.includes(userKeyword);
    };
    
    results = bookList.filter(isSearched);

    return results;
};

exports.getResultCounts = function(){
    return results.length;
};

/*
exports.getMessage = function(userKeyword){
    var message ='';
    
    if (results.length == 0){
        message = "There's no matched item for " + userKeyword + ".";
    }else{
        message = results.length + " item(s) results for '" + userKeyword + "'";
    }
    return message;
};*/