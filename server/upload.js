const express = require('express');
const multer = require('multer');
const upload = multer({ dest:'uploads/'});
const exphbs = require('express-handlebars');

const app = express();

app.use(express.static(__dirname +'/public'));

app.engine('.hbs', exphbs({ extname:'.hbs'}));
app.set('view engine','.hbs');

app.get('/', (req, res) => {
  return res.render('upload', {layout: false});
});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    return res.status(200).send(req.file);
  });

app.listen(3000, () => {
  console.log('Express server listening on port 3000');
});
