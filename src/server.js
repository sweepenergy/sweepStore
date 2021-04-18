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
  res.sendFile('index.html', { root: __dirname + '/public/pages/dropzone' });
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log("Original file name: ", req.file.originalname);
  console.log("Generated name: ", req.file.filename); 
  return res.status(200).send(req.file); 
})

app.listen(process.env.port || 3000);

//console.log('Web Server is listening at port '+ (process.env.port || 3000));
