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


		var userkey = request.body.userKey;
		var usertoken = request.body.userToken;

		const auth = `Basic ${btoa(
			userkey + ":" + usertoken
		)}`; 
	
		console.log(userkey);
		console.log(usertoken);

		axios("https://api.sweepapi.com/account/verify_auth", {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json',
				'Authorization': 'Basic OWVhNmY4YmQtYWZmMy00YmYxLTllODgtZTE4NWE0OWYxYzVkOmM1ZTkwYmJjLTQ3YTgtNGQ5Ni05Y2E1LTk3MTM0Yzc4NmFmYw==',
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
	
				//Hash info before redirecting
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


