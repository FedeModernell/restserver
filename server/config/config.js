// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || '3000';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urldb;

if (process.env.NODE_ENV == 'dev') {
    urldb = 'mongodb://localhost:27017/cafe';
} else {
    urldb = 'mongodb+srv://fedemodernell:Irunp2oPuNzHQc0d@cluster0.s58wr.mongodb.net/cafe';
};


process.env.URLDB = urldb;