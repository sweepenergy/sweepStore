const express = require('express');
const app = express();
const path = require('path');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/datasets')
  },
  filename: function (req, file, cb) {
    cb(null, 'client_data.csv');
  }
})
const upload = multer({ storage: storage });

app.use("/", express.static(path.join(__dirname, 'public/')));
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/public/pages'));
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);

/*
==========================================================
                        Routers
==========================================================
 */

app.get('/', (req,res) => {
  res.render('login.html');
});

app.post('/', function(req, res) {
    res.redirect('/upload');
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
  test.uploadParse(req.body); 
});

app.get('/organize', (req, res) => {
  res.render('mainWindow.html');
});


app.listen(process.env.port || 3000);

//console.log('Web Server is listening at port '+ (process.env.port || 3000));
