const mongoose = require('mongoose');

let beautifyUnique = require('mongoose-beautiful-unique-validation');
let esquema = mongoose.Schema;
let rolesvalidos = {
    values: [
        'ADMIN',
        'SUPER'

    ],
    message: '{VALUE} no es un rol valido'
}
let usuarioSchema = new esquema({
    nombre: {
        type: String,
        required: (true, 'El nombre es necesario')

    },
    email: {
        type: String,
        required: (true, 'El email es necesario'),
        unique: 'Email repetido'
    },
    password: {
        type: String,
        required: (true, 'El password es necesario')
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROL',
        enum: rolesvalidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true
    }


})

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userobjet = user.toObject();
    delete userobjet.password;
    return userobjet;

}

usuarioSchema.plugin(beautifyUnique);
module.exports = mongoose.model('Usuario', usuarioSchema);