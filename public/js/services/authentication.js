bookApp.factory('Authentication', function($rootScope){
    
    var auth = firebase.auth();
    var database = firebase.database();
    
    return{
        
        login : function(user){
            auth.signInWithEmailAndPassword(user.email, user.password)
            .then(function(currentUser) {
                $rootScope.loginMessage ="Welcome " + currentUser.email;
                $("#loginModal").modal("hide");
                if (currentUser != null) {
                    $rootScope.currentUser = currentUser;
                }
            }, function(error) {
                console.log(error.message);
            }); 
            
        },//login
        
        register : function(user){
             auth.createUserWithEmailAndPassword(user.email, user.password)
            .then(function(regUser) {
                database.ref('users/' + regUser.uid).set({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    regUser: regUser.uid,
                });
                $("#registerModal").modal("hide");
                console.log("register successful");
            }, function(error) {
                  console.log(error.message);
            });
            
        },//register
        
        logout : function(){
            auth.signOut().then(function() {
                $rootScope.currentUser = '';
                console.log("log out successful");
            }, function(error) {
                console.log(error.message);
            });
        }//logout   
        
    };//return
});//factory