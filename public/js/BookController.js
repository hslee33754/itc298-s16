bookApp.controller('BookController', function($scope, $http) {
    
    $http.get('/api/books')
        .then(function successCallback(response) {
            $scope.books = response.data;
            $scope.results = response.data;
        }, function errorCallback(response) {
            console.log('Error: ' + response.data);
    });
    
    function resetDisplay(){
        $scope.showResult = false;
        $scope.showDetail = false;
        $scope.showForm = false;
    }
    
    $scope.showResult = true;
    
    $scope.backtoTotal = function(){
        $scope.userInput = ""; //reset input field
        $scope.results = $scope.books;
        $scope.message = "";
        resetDisplay();
        $scope.showResult = true;
    };
    
    $scope.backtoSearch = function(){
        resetDisplay();
        $scope.showResult = true;
    };
    
    $scope.searchBooks = function(){
        resetDisplay();
        $scope.showResult = true;
        $scope.message = "Search results for '" + $scope.userInput + "'";
        function isFound(obj){
            var title = obj.title.toLowerCase();
            return title.includes($scope.userInput);
        }
            
        if ($scope.userInput == null){ //if user deletes input values, show all books
            $scope.results = $scope.books;
            $scope.message = '';
        }else{ //else if user makes other changes, show search results
            $scope.results = $scope.books.filter(isFound);
        }
        return  $scope.results;
    };
    
    $scope.getDetail = function(theId){
        resetDisplay();
        $scope.showDetail = true;

        function isMatched(obj){
            var id = obj._id;
            return id === theId;
        }
        $scope.theBook =  $scope.books.find(isMatched);
        return $scope.theBook;
    };
    
    $scope.displayForm = function(theId){
        function isMatched(obj){
            var id = obj._id;
            return id === theId;
        }
        
        if(theId){
            $scope.add = false;
            $scope.update = true;
            $scope.newBook =  $scope.books.find(isMatched);

        }else{
            $scope.add = true;
            $scope.update = false;
            $scope.newBook = {};
        }
        resetDisplay();
        $scope.showForm = true;
    };
    
    $scope.addOrUpdateBook = function(theId){
        if(theId){
            $http.post('/api/add', $scope.newBook)
                .then(function successCallback(response) {
                    $scope.postResult = response.data;                    
                    $scope.message = '"' + $scope.postResult.title + '" is updated.';
                    resetDisplay();
                    $scope.showResult = true;
                }, function errorCallback(response) {
                    console.log('Error: ' + response.data);
            });
        }else{
            $http.post('/api/add', $scope.newBook)
                .then(function successCallback(response) {
                    $scope.postResult = response.data;
                    $scope.results.push($scope.postResult);
                    $scope.message = '"' + $scope.postResult.title + '" is added.';
                    resetDisplay();
                    $scope.showResult = true;
                }, function errorCallback(response) {
                    console.log('Error: ' + response.data);
            });
        }
    };
    
    $scope.delete = function(theId){
        function isMatched(obj){
            var id = obj._id;
            return id === theId;
        }
        $scope.thisBook =  $scope.books.find(isMatched);

        $http.post('/api/delete', $scope.thisBook)
            .then(function successCallback(response) {
                $scope.postResult = response.data;
                function isNotMatched(obj){
                    var id = obj._id;
                    return id != $scope.postResult._id;
                }
                $scope.results = $scope.books.filter(isNotMatched);
                $scope.message = '"' + $scope.postResult.title + '" is deleted.';
                resetDisplay();
                $scope.showResult = true;
            }, function errorCallback(response) {
                console.log('Error: ' + response.data);
        });
    };
    
});