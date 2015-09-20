var express = require('express');
var app = express();
app.get('/', function(request, response){
	response.send("helloword");
	response.end();
});

app.listen(5009);