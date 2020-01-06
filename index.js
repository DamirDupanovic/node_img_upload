const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + 
        path.extname(file.originalname));
    }
});

//upload
//moze single ili array
//u zagradi name iz inputa iz index-a
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('slika')

//checkFileType
function checkFileType(file, cb){
    //dozvoljeni tipovi fajla
    const dozvoljeniTipovi = /jpeg|jpg|png|gif/;
    //provjeri
    const extname = dozvoljeniTipovi.test(path.extname
        (file.originalname).toLocaleLowerCase());
    //provjri mime
    const mimetype = dozvoljeniTipovi.test(file.mimetype);

    if(mimetype && extname) return cb(null, true);
    else {
        cb('Error: images only!');
    }
}

//init
const app = express();

//ejs
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', function(req, res) {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
        } else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No file Selected'
                });
            }else{
                res.render('index', {
                    msg: 'Slika uploudovana!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    }); 
});

const port = 8080;

app.listen(port, () => console.log(`Server pokrenut na portu ${port}`));