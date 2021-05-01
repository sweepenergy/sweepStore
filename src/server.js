const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');
const multer = require('multer');
const upload = multer({ dest:'src/public/datasets'});

app.use("/", express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', require('ejs').renderFile);

app.get('/', (req,res) => {
  res.sendFile('login.html', { root: __dirname + '/public/pages/' });
});

app.post('/', function(req, res) {
    //res.end(JSON.stringify(req.body));
    res.redirect('/upload');
});

app.get('/upload', (req, res) => {
  res.sendFile('upload.html', { root: __dirname + '/public/pages' });
});

var globalVar = ""; 
app.post('/upload', upload.single('file'), function(req, res) {
  console.log("File Uploaded");
  globalVar = req.file.filename; 
  res.redirect('/import');
  // const parse = require('./public/javascript/testDataOrg');
  // parse.uploadParse(req.file.filename);
}); 

app.get('/import', (req, res) => {
  //res.sendFile('import.html', { root: __dirname + '/public/pages' });
  res.render(__dirname + "/public/pages/import.html", {fileName:globalVar}); 
});

app.post('/import', (req, res) => {
  
});


app.listen(process.env.port || 3000);

//console.log('Web Server is listening at port '+ (process.env.port || 3000));
