var http = require("http"), fs = require("fs");

function serveStatic(res, path, contetnType, responseCode){
    if(!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function(err,data){
        if(err) {
            res.writeHead(500, {'Content-Type' : 'text/plain'});
            res.end('500-Internal Error');
        }else{
            res.writeHead(responseCode, {'Content-Type' : contetnType});
            res.end(data);
        }
    })
}

http.createServer(function(req,res){
    var path = req.url.toLocaleLowerCase();
    
    switch (path) {
        case '/':
            //res.writeHead(200, {'Content-Type': 'text/plain'});
            //res.end('Home page');
            serveStatic(res,'/public/home.html', 'text/html');
            break;
        case '/about':
            res.writeHead(200, {'Content-Type' : 'text/plain' });
            res.end('About page');
            break;
        default:
            res.writeHead(404, {'Content-Type' : 'text/plain'});
            res.end('Not Found');
            break;
    }
    
}).listen(process.env.PORT);
