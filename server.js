const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku
const path = require('path')
var formidable = require('formidable');
app.use(express.static('static'))
let hbs = require('express-handlebars');
const { count } = require("console");
const { mainModule } = require("process");
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));

app.set('view engine', 'hbs');
let data = []
let filesToCount = -1;


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})



app.get("/", function (req, res) {
    res.render('upload.hbs');
});

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { data });
});

app.get("/info", function (req, res) {
    // let fileId = req.query.id

    let file = [];
    let filePlace = 0;
    if (data.length > 0) {
        data.forEach(element => {

            if (element.id == req.query.id) {
                file.push(data[filePlace])
                //app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
                //res.render('info.hbs', { file })
                // return
            }
            filePlace++
        });
    }

    res.render('info.hbs', { file })

});


app.get("/delete", function (req, res) {
    let count = 0;
    data.forEach(element => {

        if (element.id == req.query.id) {
            data.splice((count), 1)

        }
        count++
    });
    res.redirect('/filemanager')
});


app.get("/reset", function (req, res) {
    data = []
    res.redirect('/filemanager')
});

app.get("/download/", function (req, res) {

    let file = [];
    let filePlace = 0;
    data.forEach(element => {

        if (element.id == req.query.id) {
            //  res.download(data[filePlace].path, data[filePlace].name)
            res.download(data[req.query.id].path, data[req.query.id].name)
            console.log(data[req.query.id].path)
        }
        filePlace++
    });

});

app.post('/fileUpload', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia

    form.parse(req, function (err, fields, files) {

        let filesUploaded = files.imagetoupload
        res.redirect('/filemanager')
        console.log(req.body)

        console.log(files)
        if (Array.isArray(filesUploaded)) {
            filesUploaded.forEach(element => {

                filesToCount++
                id = filesToCount
                let img = element.name
                let name = element.name
                let size = element.size
                let path = element.path
                let savedate = element.lastModifiedDate.getTime()
                let type = element.type
                data.push({ id, name, size, type, path, savedate })


            });
        } else {
            //let id = data[data.length].id + 1
            filesToCount++
            id = filesToCount
            let img = filesUploaded.name
            let name = filesUploaded.name
            let size = filesUploaded.size
            let path = filesUploaded.path
            let savedate = filesUploaded.lastModifiedDate.getTime()
            let type = filesUploaded.type
            data.push({ id, name, size, type, path, savedate })
        }





    });


});