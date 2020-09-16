const mongoose = require('mongoose');

const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/TEST': 'mongodb://localhost/inventory';

mongoose.connect(DB_URL, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to database', DB_URL);
})