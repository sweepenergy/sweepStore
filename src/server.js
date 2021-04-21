const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var path = require('path');
const multer = require('multer');
const upload = multer({ dest:'src/public/datasets'});

app.use("/", express.static(path.join(__dirname, 'public/')));
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/upload', upload.single('file'), (req, res) => { 
  const parse = require('./public/javascript/testDataOrg'); 
  parse.uploadParse(req.file.filename); 
})

app.get('/import', (req, res) => {
  res.sendFile('import.html', { root: __dirname + '/public/pages' });
});

app.post('/import', (req, res) => {
  //const importt = require('./public/pages/visualViewer'); 
  //importt.readFile(req.file.filename); 
});


app.listen(process.env.port || 3000);

//console.log('Web Server is listening at port '+ (process.env.port || 3000));
