const express = require('express');
const app = express();
const path = require('path');

const multer = require('multer');

const session = require('express-session');

var redis   = require("redis");
var connectRedis = require('connect-redis')(session);
var client = require('redis').createClient();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/datasets')
  },
  filename: function (req, file, cb) {
    cb(null, 'client_data.csv');
  }
})

const upload = multer({ storage: storage });
const btoa = require("btoa");
const axios = require('axios');

app.use("/", express.static(path.join(__dirname, 'public/')));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  store: new connectRedis({host: 'localhost', port: 6379, client: client}),
  secret: "sweepStoreAdmin",
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

app.set('trust proxy', 1);
app.set('views', path.join(__dirname, '/public/pages'));
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);

/*
==========================================================
                        Routers
==========================================================
 */

//Storing key and token as global variables so they can be used in dataOrg files
global.key;
global.token; 

app.get('/', (req,res) => {
  const sess = req.session;
  if (sess.userkey && sess.usertoken) {
      if (sess.userkey) {
          console.log(sess);
          key = sess.userkey;
          token = sess.usertoken; 
          res.redirect('/upload');
          //res.end('<a href=' + '/logout' + '>Click here to log out</a >')
      }
  } else {
      res.render('login.html');
  }
});


app.post('/auth', function(req, res) {
	var userkey = req.body.userkey;
	var usertoken = req.body.usertoken;

  key = req.body.userkey;
  token = req.body.usertoken; 

  const sess = req.session;

	const auth = `Basic ${btoa(
		userkey + ":" + usertoken
	)}`;

  sess.userkey = userkey;
  sess.usertoken = usertoken;

	axios("https://api.sweepapi.com/account/verify_auth", {
		method: 'GET',
		headers: {
			'Content-Type' : 'application/json',
			Authorization: auth,
		}
	})
	.then(function (response) {
		console.log("account/verify_auth res:", response.data);
		var string = JSON.stringify(response.data);
		

		if (string !== '{"status":"ok"}') {
			console.log("User is not authenticated. Try Again.");
			res.redirect('/login');
		} else {
			console.log("User is authenticated!");
      //req.session.key = userkey;
			res.redirect('/upload');
		}
	})
	.catch(function (error) {
		console.log(error);
	});

});

app.get('/login', function(req, res) {
	res.render('login.html');
});

app.get('/upload', (req, res) => {
  res.render('upload.html');
});

app.post('/upload', upload.single('file'), function(req, res) {
  res.redirect('/import');
}); 

app.get('/import', (req, res) => {
  res.render('import.html'); 
});

app.post('/import', (req, res) => { 
  //console.log("User specified column types: ", req.body);  

  const test = require('./public/javascript/testDataOrg');
  test.getColumns(req.body); 
});

app.get('/organize', (req, res) => {
  res.render('mainWindow.html');
});

/*app.get('/logout',function(req,res){
  req.session.destroy(function(err){
      if(err){
          console.log(err);
      } else {
          res.redirect('/');
      }
  });
});*/

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});