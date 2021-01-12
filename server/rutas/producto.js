const express = require('express');
const app = express();
const _ = require('underscore');

const FuncToken = require('../../middlewares/autenticacion')


let Producto = require('../modelo/producto');


// ============================
//  Todos Los productos
// ============================

//populate
//paginado
//

app.get('/producto', [FuncToken.autenticacion], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, ProductoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    cantidad: conteo,
                    ok: true,
                    ProductoBD

                })
            })
        });
});



app.get('/producto/buscar/:termino', [FuncToken.autenticacion], (req, res) => {

    let termino = req.params.termino;

    let regx = new RegExp(termino, 'i');
    Producto.find({ nombre: regx })
        .populate('categoria', 'nombre')
        .exec((err, ProductoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                ProductoBD

            })
        });

});

app.post('/producto', [FuncToken.autenticacion], (req, res) => {
    //categoria.findbyid
    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        usuario: req.usuario._id,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria

    });

    producto.save((err, ProductoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            ProductoDB
        })

    })

});


// ============================
//  Producto por ID
// ============================

//populate
//paginado
//

module.exports = app;