require('./config/config');

const express = require('express');
const app = express();



const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online')
});

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./rutas/usuario'))

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});