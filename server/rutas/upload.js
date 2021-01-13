const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../modelo/usuario');
const fs = require('fs');
const path = require('path');
let Producto = require('../modelo/producto');

app.use(fileUpload());


//Extensiones permitdas



app.put('/upload/:tipo/:id', function(req, res) {
    let sampleFile;

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ah seleccionado archivo'
            }
        });

    }

    //Validar tipo
    let TipoValido = ['productox', 'usuarios'];

    if (TipoValido.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Tipo no valido los tipos validos son' + TipoValido.join(', ', ),
                tipo: tipo

            }
        });
    }

    let archivo = req.files.archivo;

    let nombrecortado = archivo.name.split('.');
    let extension = nombrecortado[nombrecortado.length - 1];


    console.log(extension);



    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Extension no valida las posibles son ' + extensiones.join(', '),
                ext: extension

            }
        });
    }
    //Cambiar Nombre archivo
    let nombrearchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    let uploadPath = `Archivos/${tipo}/${nombrearchivo}`;
    archivo.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se ah seleccionado archivo'
                }
            });

        //IMAGEN CARGADA
        if (tipo === 'usuarios') {
            imagenusuario(id, res, nombrearchivo);
        } else { imagenProducto(id, res, nombrearchivo) };


    });
});

function imagenusuario(id, res, nombrearchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            EliminarArchivo(nombrearchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioBD) {
            EliminarArchivo(nombrearchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        };

        EliminarArchivo(usuarioBD.img, 'usuarios')

        UsuarioBD.img = nombrearchivo;

        usuarioBD.save((err, UsuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                UsuarioGuardado,
                img: nombrearchivo
            });

        });

    });



};



function imagenProducto(id, res, nombrearchivo) {

    Producto.findById(id, (err, ProductoBD) => {

        if (err) {
            EliminarArchivo(nombrearchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!ProductoBD) {
            EliminarArchivo(nombrearchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        };

        EliminarArchivo(ProductoBD.img, 'productos')

        ProductoBD.img = nombrearchivo;

        ProductoBD.save((err, productoguardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productoguardado,
                img: nombrearchivo
            });

        });

    });



};




function EliminarArchivo(nombrearchivo, tipo) {
    let pathurl = path.resolve(__dirname, `../../Archivos/${tipo}/${nombrearchivo}`);
    if (fs.existsSync(pathurl)) {
        fs.unlinkSync(pathurl);
    }
}

module.exports = app;