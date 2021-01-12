const express = require('express');
const app = express();
const _ = require('underscore');

const FuncToken = require('../../middlewares/autenticacion')


let Categoria = require('../modelo/categoria');

// ============================
//  Todas las categoria
// ============================

app.get('/categoria', [FuncToken.autenticacion], (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    cantidad: conteo,
                    ok: true,
                    categoriaBD

                })
            })
        });
});
// ============================
//  Categoria por ID
// ============================

app.get('/categoria/:id', [FuncToken.autenticacion], (req, res) => {
    //categoria.findbyid
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe el usuario' }
            });

        } else {


            res.json({
                ok: true,
                categoriaBD

            });

        }
    });


});

// ============================
//  Regresa nueva categoria
// ============================
app.post('/categoria', [FuncToken.autenticacion], (req, res) => {
    //categoria.findbyid
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        idusuario: req.usuario._id
    });

    categoria.save((err, CategoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            CategoriaDB
        })

    })

});

// ============================
//  actualiza nueva categoria
// ============================
app.put('/categoria', (req, res) => {
    //categoria.findbyid

});

// ============================
//  Elimina categoria
// ============================
app.put('/categoria', (req, res) => {
    //categoria.findbyid
    //Solo admin puede borrar categoria
    //Token
    //Eliminar fisicamente
});

module.exports = app

module.exports = app