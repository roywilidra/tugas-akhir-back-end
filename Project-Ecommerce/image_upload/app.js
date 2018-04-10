var express = require('express');
var app = express();

app.set('view engine',"ejs");

var bodyParser = require('body-parser')
var url = bodyParser.urlencoded({ extended: false })

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.get('/', function(req, res)
{
    res.render(__dirname+'/views/satu',
    {

    });
})

app.post('/upload', function(req,res)
{
    if(!req.files.userfile)
    return res.status(400).send('no files were uploaded.');

    let userfile = req.files.userfile;

    userfile.mv(__dirname +'/image/'+ uniqid() + '.' + req.files.userfile.mimetype.split('/')[1], function(err) {
        if (err)
        return res.status(500).send(err);

        res.send('File Uploaded!');

    });
});

//untuk membuat unik id pada image file

var uniqid = require('uniqid');
console.log(uniqid());
console.log(uniqid(), uniqid());


//untuk menghapus unik id pada image file

// var fs = require('fs');
// var filePath = __dirname +'/image/1r411tebjfkt7pre.jpeg'
// fs.unlinkSync(filePath);

app.listen(3001);