var bookApp = angular.module('bookApp',[])
.run(['$rootScope', function($rootScope){
    var config = {
    apiKey: "AIzaSyB5rKtmUYATMBIqBb9paSE4U6A7R-dz02I",
    authDomain: "exbook-99e1e.firebaseapp.com",
    databaseURL: "https://exbook-99e1e.firebaseio.com",
    storageBucket: "exbook-99e1e.appspot.com",
  };
  firebase.initializeApp(config);
}]);
