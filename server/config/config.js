// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || '3000';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urldb;

if (process.env.NODE_ENV == 'dev') {
    urldb = 'mongodb://localhost:27017/cafe';
} else {
    urldb = process.env.MONGO_URI;
};


process.env.URLDB = urldb;