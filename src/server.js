/*const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

router.get('/', (req,res) => {
  res.send('<h1>Hello World, Welcome to a Electron app!</h1>');
});

app.use('/', router);

app.listen(process.env.port || 3000); */

//console.log('Web Server is listening at port '+ (process.env.port || 3000));


const express = require('express');
const multer = require('multer');
const upload = multer({ dest:'public/'});
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.use(express.static(__dirname +'/server'));

//app.set('views', path.join(__dirname, 'pages/dropzone'));
//app.set('view engine','html');
app.set('views', path.join(__dirname, '../server/views'));
app.set('view engine','pug');

app.get('/', (req, res) => {
  return res.render('index', {layout: false});
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); 
  return res.status(200).send(req.file);
});

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});