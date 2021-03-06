const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../modelo/usuario');
const _ = require('underscore');

const FuncToken = require('../../middlewares/autenticacion')

app.get('/usuario', FuncToken.autenticacion, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({}, 'nombre email ')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
                return;
            }

            Usuario.count({}, (err, conteo) => {
                res.json({
                    cantidad: conteo,
                    ok: true,
                    usuarios

                })
            })


        })
});

app.post('/usuario', [FuncToken.autenticacion, FuncToken.VerificaAdminRol], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role


    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
            return;
        }
        res.json({
            ok: true,
            nombre: usuarioDB
        })

    })




});

app.delete('/usuario/:id', [FuncToken.autenticacion, FuncToken.VerificaAdminRol], (req, res) => {


    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        /*let cambiaEstado = {
                estado: false
            };

            Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {*/

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});
module.exports = app