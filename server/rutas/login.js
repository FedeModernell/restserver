const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelo/usuario');
const app = express();



/*
app.post('/login', function(req, res) {

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
*/

app.post('/login', function(req, res) {

    let body = req.body;
    console.log(body.email);
    Usuario.findOne({ email: body.email }, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!UsuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o password incorrectos'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o password incorrectos'
                }
            });
        };

        let token = jwt.sign({
            usuario: UsuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });


        res.json({
            ok: true,
            usuario: UsuarioDB,
            token
        })
    })




});



module.exports = app