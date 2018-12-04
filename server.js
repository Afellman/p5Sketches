var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('server1.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var inter = fs.readFileSync('intermediate.crt', 'utf8');
var express = require('express');
var app = express();
var path = require('path')
// your express configuration here

app.use(function(req, res, next) {
  if (req.secure) {
    console.log('secure')
    next();
  } else {
      res.redirect('https://andrewefellman.com');
  }
});

app.use(express.static(__dirname + '/'))
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'))
})

const options = {
    key: privateKey,
    cert: certificate,
    ca : inter
};

https.createServer(options, app).listen(443);
http.createServer(app).listen(80)
