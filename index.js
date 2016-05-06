//express
var express = require('express');
var app = express();

//set up handlebars view engine
var handlebars = require('express-handlebars').create({defaultLayout:'main'});    
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//body-Parser Configuration
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

//static files and views
app.use(express.static(__dirname + '/public'));

//set port 
app.set('port', process.env.PORT || 3000); //app.listen(3000);?

//routes
require('./routes.js')(app);

//set Cross-Origin Resource Sharing
app.use('/api', require('cors')());

//start server
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});