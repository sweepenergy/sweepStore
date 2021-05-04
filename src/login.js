var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const multer = require('multer');
const upload = multer({ dest:'src/public/datasets'});

const store = require("store2");
const axios = require('axios');

var app = express();

app.use("/", express.static(path.join(__dirname, 'public/')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
    response.sendFile('login.html', { root: __dirname + '/public/pages/' });
});


app.post('/auth', function(request, response) {
	var userkey = request.body.userkey;
	var usertoken = request.body.usertoken;

	var getKey = store.get('key');
	var getToken = store.get('token');

	if(userkey && usertoken){
		//check if key and token has already been saved
		if (store.get('key') && store.get('token')!== null){
			//check if the saved key and token match the inputted key and token
			if (getKey == userkey && getToken == usertoken){
				response.redirect('/upload');
				console.log(response);
			
				}
		//check if key and token is valid
		} else {
				//still doesn't work
				axios({
							method: "post",
							url: 'https://api.sweepapi.com/account/auth',
							headers: {
								'Content-Type' : 'application/json',
							},
							data: JSON.stringify({
								'email': userkey,
								'password': usertoken,
								}),
				//once valid, save inputted key and token to storage
				}).then(function (response) {
							store.set('key', userkey);
							store.set('token', usertoken);
							response.redirect('/upload');
							console.log(response);
					});
				}
	} else {
		console.log('User is not authenticated');
		response.redirect('/login');
	} 
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