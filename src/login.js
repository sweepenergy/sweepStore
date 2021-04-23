var mysql = require('mysql2');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const multer = require('multer');
const upload = multer({ dest:'src/public/datasets'});

var connection = mysql.createConnection({
	//host     : 'localhost',
	host  : "127.0.0.1",
	port     : "3306",
	user     : "root",
	password : "project123",
	database : "login",
	socketPath  : "/tmp/mysql.sock",
});

var app = express();
app.use(session({
	secret: "sweepStoreAdmin",
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/login.html'));
    response.sendFile('login.html', { root: __dirname + '/public/pages/' });
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.username = password;
				response.redirect('/upload');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Your Username and Password cannot be found!');
		response.end();
	}
});

app.get('/upload', function(request, response) {
	//if (request.session.loggedin) {
    	response.sendFile('upload.html', { root: __dirname + '/public/pages' });
		//response.send('Welcome back, ' + request.session.username + '!');
	//} else {
		//response.send('Please login to view this page!');
	//}
	//response.end();
});
app.post('/upload', upload.single('file'), function(request, response) { 
	const parse = require('./public/javascript/testDataOrg'); 
	parse.uploadParse(request.file.filename);
	return response.status(200).send(request.file);
  })
/*app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});*/

//app.listen(3000);

connection.connect((err) => {
	if(err){
	  console.log('Error connecting to DB');
	  return;
	}
	console.log('Connection established to DB');
  });

  /*connection.end((err) => {
	// The connection is terminated gracefully
	// Ensures all remaining queries are executed
	// Then sends a quit packet to the MySQL server.
  });*/

app.listen(3000, () => {
    console.log('Express server listening on port 3000');
  });
  