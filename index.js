var http = require("http"), fs = require("fs");

http.createServer(function(req,res){
    console.log("test1")
    res.writeHead(200, {'Content-Type' : 'text/plain' });
    res.end('Aloha World');
    
}).listen(process.env.PORT);
console.log("test2")