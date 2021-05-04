var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const multer = require('multer');
const upload = multer({ dest:'src/public/datasets'});

const store = require("store2");
const axios = require('axios');
const btoa = require("btoa");

var app = express();

app.use("/", express.static(path.join(__dirname, 'public/')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
    response.sendFile('login.html', { root: __dirname + '/public/pages/' });
});

app.post('/auth', function(request, response) {
	//var userkey = '';
	//var usertoken = '';

	var userkey = 'e0eab27d-da5c-4a03-803e-b1330749e9cc';
	var usertoken = '4b0a9751-d753-455f-a9ee-d12f5a65f808';

	const auth = `Basic ${btoa(
		userkey + ":" + usertoken
	)}`; 

	axios("https://api.sweepapi.com/account/verify_auth", {
		method: 'GET',
		headers: {
			'Content-Type' : 'application/json',
			Authorization: auth,
		}
	})
	.then(function (res) {
		console.log("account/verify_auth res:", res.data);
		var string = JSON.stringify(res.data);
		
		if (string !== '{"status":"ok"}') {
			console.log("User is not authenticated. Try Again.");
			response.redirect('/login');
		} else {
			console.log("User is authenticated!");
			response.redirect('/upload');
		}
	})
	.catch(function (error) {
		console.log(error);
	});
});

app.get('/upload', function(request, response) {
	response.sendFile('upload.html', { root: __dirname + '/public/pages' });

});

app.post('/upload', upload.single('file'), function(request, response) { 
	const parse = require('./public/javascript/testDataOrg'); 
	parse.uploadParse(request.file.filename);
	return response.status(200).send(request.file);
	})

app.get('/login', function(request, response) {
	response.sendFile('login.html', { root: __dirname + '/public/pages' });
});

app.listen(3000, () => {
    console.log('Express server listening on port 3000');
  });