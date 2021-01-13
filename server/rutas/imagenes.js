const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const FuncToken = require('../../middlewares/autenticacion')


app.get('/imagen/:tipo/:img', FuncToken.autenticacionimg, function(req, res) {


    let tipo = req.params.tipo;
    let img = req.params.img


    let pathurl = path.resolve(__dirname, `../../Archivos/${tipo}/${img}`);
    if (fs.existsSync(pathurl)) {
        res.sendFile(pathurl);
    } else {

        let noimagen = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noimagen);
    }

});

module.exports = app;