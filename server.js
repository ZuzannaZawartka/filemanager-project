const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000; // bardzo istotna linijka - port zostaje przydzielony przez Heroku
const path = require('path')
var formidable = require('formidable');
app.use(express.static('static'))
let hbs = require('express-handlebars');
const { count } = require("console");
const { mainModule } = require("process");
const { unwatchFile } = require("fs");
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
    console.log(req.query.id)

    data.forEach(element => {
        if (element.id == req.query.id) {
            res.download(data[filePlace].path, data[filePlace].name)
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

        let types = [
            { name: "image/jpeg", img: "/image/jpeg.png" },
            { name: "image/jpg", img: "/image/jpg.png" },
            { name: "image/png", img: "/image/png.png" },
            { name: "image/gif", img: "/image/gif.png" },
            { name: "application/pdf", img: "/image/pdf.png" },
            { name: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", img: "/image/doc.png" },
            //  { name: "application/vnd.oasis.opendocument.presentation", img: "/image/odp.png" },
            { name: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", img: "/image/xls.png" },
            { name: "application/x-zip-compressed", img: "/image/zip.png" },
            { name: "text/plain", img: "/image/txt.png" },
            { name: "application/vnd.ms-powerpoint", img: "/image/ppt.png" },



        ]
        if (Array.isArray(filesUploaded)) {

            filesUploaded.forEach(element => {

                filesToCount++
                id = filesToCount
                let img;
                types.forEach(element2 => {
                    if (element2.name == element.type) {
                        return img = element2.img
                    }
                });

                if (img == undefined) {
                    img = "/image/none.png"
                }

                let name = element.name
                let size = element.size
                let path = element.path
                let savedate = element.lastModifiedDate.getTime()
                let type = element.type
                data.push({ id, img, name, size, type, path, savedate })


            });
        } else {
            //let id = data[data.length].id + 1
            filesToCount++
            id = filesToCount
            let img;
            types.forEach(element2 => {
                if (element2.name == filesUploaded.type) {
                    return img = element2.img
                }
            });

            if (img == undefined) {
                img = "/image/none.png"
            }
            let name = filesUploaded.name
            let size = filesUploaded.size
            let path = filesUploaded.path
            let savedate = filesUploaded.lastModifiedDate.getTime()
            let type = filesUploaded.type
            data.push({ id, img, name, size, type, path, savedate })
        }


        console.log(data)


    });


});