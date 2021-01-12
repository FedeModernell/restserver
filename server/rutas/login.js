const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelo/usuario');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);




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


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    console.log(token)

    let retorno = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    console.log(retorno);
    Usuario.findOne({ email: retorno.email }, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (UsuarioDB) { //Si existe usuario
            console.log('existe ');
            if (UsuarioDB.google === false) { //No se logueo con google
                console.log('no es google ');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su atenticacion'
                    }
                })

            } else {
                console.log('google ');
                let token = jwt.sign({
                    usuario: UsuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });
                return res.json({
                    ok: true,
                    usuario: UsuarioDB,
                    token
                })
            }
        } else {
            console.log('-----RETORNO' + retorno.img)
            let usuario = new Usuario({
                nombre: retorno.nombre,
                email: retorno.email,
                img: retorno.img,
                google: true,
                password: 'null'


            });

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })

                }

                let token = jwt.sign({
                    usuario: UsuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

                res.json({
                    ok: true,
                    nombre: usuarioDB,
                    token
                })

            })

        }

    })

});

async function verify(token) {
    console.log(process.env.CLIENTID);
    const ticket = await client.verifyIdToken({

        idToken: token,
        audience: process.env.CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload.name);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}



module.exports = app