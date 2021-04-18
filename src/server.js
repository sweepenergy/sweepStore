const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var path = require('path');

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

app.listen(process.env.port || 3000);

console.log('Web Server is listening at port '+ (process.env.port || 3000));
