// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || '3000';

// ============================
//  AMBIENTE
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  BASE DE DATOS
// ============================
let urldb;

if (process.env.NODE_ENV == 'dev') {
    urldb = 'mongodb://localhost:27017/cafe';
} else {
    urldb = process.env.MONGO_URI;
};

// ============================
//  VENCIMIENTO TOKEN
// ============================
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

// ============================
//  SEED
// ============================

process.env.SEED = process.env.SEED || 'SEED-DESARROLLO';


process.env.URLDB = urldb;


// ============================
//  GOOGLE CLIENT ID
// ============================

process.env.CLIENTID = process.env.CLIENTID || '406324671510-efrg66s7m6o9qub3lqri1avnp090bdg4.apps.googleusercontent.com';