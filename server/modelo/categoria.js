const mongoose = require('mongoose');

let beautifyUnique = require('mongoose-beautiful-unique-validation');
let esquema = mongoose.Schema;


let CategoriaSchema = new esquema({
    nombre: {
        type: String,
        required: (true, 'El nombre es necesario'),
        unique: 'Nombre repetido'

    },
    idusuario: {
        type: String,
        required: (true, 'El email es necesario'),
    }


})



CategoriaSchema.plugin(beautifyUnique);
module.exports = mongoose.model('Categoria', CategoriaSchema);