const jwt = require('jsonwebtoken');
// ============================
//  VERIFICAR AUTENTICACION
// ============================

let autenticacion = (req, res, next) => {

    let token = req.get('token');
    //Valida la semilla
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario; //Devuelve el paylot, todo lo que quisite enviar
        next();
    })


}

let VerificaAdminRol = (req, res, next) => {

    let usuario = req.body;

    if (usuario.role != 'ADMIN') {
        console.log('entro')
        return res.status(401).json({
            ok: false,
            message: 'El usuario no es ADMIN'
        })

    } else {
        console.log('no entro')
    };
    next();

}





module.exports = { autenticacion, VerificaAdminRol };