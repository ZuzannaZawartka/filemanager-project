const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku
const path = require('path')
var formidable = require('formidable');
app.use(express.static('static'))
let hbs = require('express-handlebars');
const { count } = require("console");
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
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

app.get("/info/:id", function (req, res) {
    res.render('info.hbs');
});

app.get("/delete", function (req, res) {
    data.forEach(element => {

        if (element.id == req.query.id) {
            data.splice((element.id), 1)
        }
    });



    console.log(req.query.id)
    console.log(data)

    res.redirect('/filemanager')


});

app.post('/fileUpload', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia

    form.parse(req, function (err, fields, files) {

        let filesUploaded = files.imagetoupload
        res.redirect('/filemanager')


        if (Array.isArray(filesUploaded)) {
            filesUploaded.forEach(element => {

                filesToCount++
                id = filesToCount
                let img = element.name
                let name = element.name
                let size = element.size
                let type = element.type
                data.push({ id, name, size, type })
                console.table(data)

            });
        } else {
            //let id = data[data.length].id + 1
            filesToCount++
            id = filesToCount
            let img = filesUploaded.name
            let name = filesUploaded.name
            let size = filesUploaded.size
            let type = filesUploaded.type
            data.push({ id, name, size, type })
        }





    });

});